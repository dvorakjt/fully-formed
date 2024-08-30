import {
  StateManager,
  Validity,
  type Excludable,
  type ExcludableState,
  type Message,
  type CancelableSubscription,
  type StateWithChanges,
} from '../../shared';
import {
  CombinedValidatorSuite,
  type IValidator,
  type ValidatorTemplate,
  type IAsyncValidator,
  type AsyncValidatorTemplate,
} from '../../validators';
import type { Subscription } from 'rxjs';
import type { IField, SetExclude, FieldState } from '../interfaces';

type ExcludableFieldConstructorParams<
  T extends string,
  S,
  U extends boolean = false,
> = {
  name: T;
  defaultValue: S;
  id?: string;
  transient?: U;
  validators?: Array<IValidator<S>>;
  validatorTemplates?: Array<ValidatorTemplate<S>>;
  asyncValidators?: Array<IAsyncValidator<S>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<S>>;
  pendingMessage?: string;
  excludeByDefault?: boolean;
  delayAsyncValidatorExecution?: number;
};

export type ExcludableFieldState<T> = FieldState<T> & ExcludableState;

export class ExcludableField<T extends string, S, U extends boolean = false>
  implements IField<T, S, U>, Excludable, SetExclude
{
  public readonly name: T;
  public readonly id: string;
  public readonly transient: U;
  private defaultValue: S;
  private excludeByDefault: boolean;
  private validatorSuite: CombinedValidatorSuite<S>;
  private stateManager: StateManager<ExcludableFieldState<S>>;
  private validatorSuiteSubscription?: CancelableSubscription;

  public get state(): StateWithChanges<ExcludableFieldState<S>> {
    return this.stateManager.state;
  }

  public constructor({
    name,
    id,
    transient,
    defaultValue,
    validators,
    validatorTemplates,
    asyncValidators,
    asyncValidatorTemplates,
    pendingMessage,
    excludeByDefault,
    delayAsyncValidatorExecution,
  }: ExcludableFieldConstructorParams<T, S, U>) {
    this.name = name;
    this.id = id ?? this.name;
    this.transient = !!transient as U;
    this.defaultValue = defaultValue;
    this.excludeByDefault = !!excludeByDefault;

    this.validatorSuite = new CombinedValidatorSuite<S>({
      validators,
      validatorTemplates,
      asyncValidators,
      asyncValidatorTemplates,
      pendingMessage,
      delayAsyncValidatorExecution,
    });

    const { syncResult, observableResult } = this.validatorSuite.validate(
      this.defaultValue,
    );

    const initialState: ExcludableFieldState<S> = {
      ...syncResult,
      submitted: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      exclude: this.excludeByDefault,
    };

    this.stateManager = new StateManager<ExcludableFieldState<S>>(initialState);

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.stateManager.updateProperties({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
        hasBeenModified: false,
      });
    });
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
        hasBeenModified: true,
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

  public setSubmitted(): void {
    this.stateManager.updateProperties({ submitted: true });
  }

  public focus(): void {
    this.stateManager.updateProperties({ isInFocus: true });
  }

  public blur(): void {
    this.stateManager.updateProperties({
      isInFocus: false,
      hasBeenBlurred: true,
    });
  }

  public cancelFocus(): void {
    this.stateManager.updateProperties({ isInFocus: false });
  }

  public reset(): void {
    this.validatorSuiteSubscription?.unsubscribeAndCancel();

    const { syncResult, observableResult } = this.validatorSuite.validate(
      this.defaultValue,
    );

    const initialState: ExcludableFieldState<S> = {
      ...syncResult,
      submitted: false,
      isInFocus: this.state.isInFocus,
      hasBeenBlurred: false,
      hasBeenModified: false,
      exclude: this.excludeByDefault,
    };

    this.stateManager.updateProperties(initialState);

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.stateManager.updateProperties({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
        hasBeenModified: false,
      });
    });
  }

  private getNonPendingMessages(): Message[] {
    return this.state.messages.filter(
      message => message.validity !== Validity.Pending,
    );
  }
}
