import { StateManager, Validity } from '../../shared';
import { CombinedValidatorSuite } from '../../validators';
import type {
  CancelableSubscription,
  Message,
  Stateful,
  StateWithChanges,
} from '../../shared';
import type {
  IValidator,
  ValidatorTemplate,
  IAsyncValidator,
  AsyncValidatorTemplate,
} from '../../validators';
import type { FieldState, IField } from '../interfaces';
import type { Subscription } from 'rxjs';

type InitFn<T extends Stateful, V> = (controllerState: T['state']) => V;

type ControlFn<T extends Stateful, V> = (
  controllerState: T['state'],
) => V | undefined | void;

type ControlledFieldConstructorParams<
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

export class ControlledField<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean = false,
> implements IField<T, S, V>
{
  public readonly name: T;
  public readonly id: string;
  public readonly transient: V;
  private validatorSuite: CombinedValidatorSuite<S>;
  private stateManager: StateManager<FieldState<S>>;
  private validatorSuiteSubscription?: CancelableSubscription;
  private controller: U;
  private initFn: InitFn<U, S>;
  private controlFn: ControlFn<U, S>;

  public get state(): StateWithChanges<FieldState<S>> {
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
  }: ControlledFieldConstructorParams<T, S, U, V>) {
    this.name = name;
    this.transient = !!transient as V;
    this.id = id ?? this.name;
    this.validatorSuite = new CombinedValidatorSuite({
      validators,
      validatorTemplates,
      asyncValidators,
      asyncValidatorTemplates,
      pendingMessage,
      delayAsyncValidatorExecution,
    });
    this.controller = controller;
    this.initFn = initFn;
    this.controlFn = controlFn;

    const initialValue = this.initFn(this.controller.state);

    const { syncResult, observableResult } =
      this.validatorSuite.validate(initialValue);

    const initialState: FieldState<S> = {
      ...syncResult,
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

  public subscribeToState(
    cb: (state: StateWithChanges<FieldState<S>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
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
    this.stateManager.updateProperties({
      submitted: true,
    });
  }

  public reset(): void {
    this.validatorSuiteSubscription?.unsubscribeAndCancel();

    const initialValue = this.initFn(this.controller.state);

    const { syncResult, observableResult } =
      this.validatorSuite.validate(initialValue);

    const initialState = {
      ...syncResult,
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

  private getNonPendingMessages(): Message[] {
    return this.state.messages.filter(
      message => message.validity !== Validity.Pending,
    );
  }

  private subscribeToController(): void {
    this.controller.subscribeToState(state => {
      const value = this.controlFn(state);

      if (value === undefined) return;

      this.setValue(value);
    });
  }
}
