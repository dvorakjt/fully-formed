import { StateManager, Validity } from '../../shared';
import { CombinedValidatorSuite } from '../../validators';
import type { ExcludableFieldState } from './excludable-field';
import type {
  Stateful,
  StateWithChanges,
  Excludable,
  CancelableSubscription,
  Message,
} from '../../shared';
import type {
  IValidator,
  ValidatorTemplate,
  IAsyncValidator,
  AsyncValidatorTemplate,
} from '../../validators';
import type { IField, SetExclude } from '../interfaces';
import type { Subscription } from 'rxjs';

type ControlFnReturnType<T> =
  | { value: T; exclude: boolean }
  | { value: T }
  | { exclude: boolean }
  | undefined
  | void;

type InitFn<T extends Stateful, V> = (controllerState: T['state']) => {
  value: V;
  exclude: boolean;
};

type ControlFn<T extends Stateful, V> = (
  controllerState: T['state'],
) => ControlFnReturnType<V>;

type ControlledExcludableFieldConstructorParams<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean,
> = {
  name: T;
  controller: U;
  initFn: InitFn<U, S>;
  controlFn: ControlFn<U, S>;
  id?: string;
  transient?: V;
  validators?: Array<IValidator<S>>;
  validatorTemplates?: Array<ValidatorTemplate<S>>;
  asyncValidators?: Array<IAsyncValidator<S>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<S>>;
  pendingMessage?: string;
  delayAsyncValidatorExecution?: number;
};

export class ControlledExcludableField<
    T extends string,
    S,
    U extends Stateful,
    V extends boolean = false,
  >
  implements IField<T, S, V>, Excludable, SetExclude
{
  public readonly name: T;
  public readonly id: string;
  public readonly transient: V;
  private controller: U;
  private initFn: InitFn<U, S>;
  private controlFn: ControlFn<U, S>;
  private validatorSuite: CombinedValidatorSuite<S>;
  private stateManager: StateManager<ExcludableFieldState<S>>;
  private validatorSuiteSubscription?: CancelableSubscription;

  public get state(): StateWithChanges<ExcludableFieldState<S>> {
    return this.stateManager.state;
  }

  public constructor({
    name,
    controller,
    initFn,
    controlFn,
    id,
    transient,
    validators,
    validatorTemplates,
    asyncValidators,
    asyncValidatorTemplates,
    pendingMessage,
    delayAsyncValidatorExecution,
  }: ControlledExcludableFieldConstructorParams<T, S, U, V>) {
    this.name = name;
    this.id = id ?? this.name;
    this.transient = !!transient as V;

    this.controller = controller;
    this.initFn = initFn;
    this.controlFn = controlFn;

    this.validatorSuite = new CombinedValidatorSuite({
      validators,
      validatorTemplates,
      asyncValidators,
      asyncValidatorTemplates,
      pendingMessage,
      delayAsyncValidatorExecution,
    });

    const { value, exclude } = this.initFn(this.controller.state);

    const { syncResult, observableResult } =
      this.validatorSuite.validate(value);

    const initialState = {
      ...syncResult,
      exclude,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    };

    this.stateManager = new StateManager(initialState);

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.stateManager.updateProperties({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      });
    });

    this.subscribeToController();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<ExcludableFieldState<S>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  public setValue(value: S): void {
    this.validatorSuiteSubscription?.unsubscribeAndCancel();

    const { syncResult, observableResult } =
      this.validatorSuite.validate(value);

    this.stateManager.updateProperties({
      ...syncResult,
      hasBeenModified: true,
    });

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.stateManager.updateProperties({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      });
    });
  }

  public setValidityAndMessages(
    validity: Validity,
    messages: Message[] = [],
  ): void {
    this.validatorSuiteSubscription?.unsubscribeAndCancel();
    this.stateManager.updateProperties({ validity, messages });
  }

  public setExclude(exclude: boolean): void {
    this.stateManager.updateProperties({ exclude });
  }

  public focus(): void {
    this.stateManager.updateProperties({
      isInFocus: true,
    });
  }

  public blur(): void {
    this.stateManager.updateProperties({
      isInFocus: false,
      hasBeenBlurred: true,
    });
  }

  public cancelFocus(): void {
    this.stateManager.updateProperties({
      isInFocus: false,
    });
  }

  public setSubmitted(): void {
    this.stateManager.updateProperties({ submitted: true });
  }

  public reset(): void {
    this.validatorSuiteSubscription?.unsubscribeAndCancel();

    const { value, exclude } = this.initFn(this.controller.state);

    const { syncResult, observableResult } =
      this.validatorSuite.validate(value);

    const initialState = {
      ...syncResult,
      exclude,
      isInFocus: this.state.isInFocus,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    };

    this.stateManager.updateProperties(initialState);

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.stateManager.updateProperties({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      });
    });
  }

  private subscribeToController(): void {
    this.controller.subscribeToState(state => {
      const controlFnResult = this.controlFn(state);

      if (!controlFnResult) return;

      if ('value' in controlFnResult) {
        this.validatorSuiteSubscription?.unsubscribeAndCancel();

        const { syncResult, observableResult } = this.validatorSuite.validate(
          controlFnResult.value,
        );

        this.stateManager.updateProperties({
          ...syncResult,
          exclude:
            'exclude' in controlFnResult ?
              controlFnResult.exclude
            : this.state.exclude,
        });

        this.validatorSuiteSubscription = observableResult?.subscribe(
          result => {
            this.stateManager.updateProperties({
              ...result,
              messages: [...this.getNonPendingMessages(), ...result.messages],
            });
          },
        );
      } else {
        this.stateManager.updateProperties({
          exclude: controlFnResult.exclude,
        });
      }
    });
  }

  private getNonPendingMessages(): Message[] {
    return this.state.messages.filter(
      message => message.validity !== Validity.Pending,
    );
  }
}
