import { StateManager, Validity, type Message } from '../../shared';
import {
  CombinedValidatorSuite,
  type IValidator,
  type ValidatorTemplate,
  type IAsyncValidator,
  type AsyncValidatorTemplate,
} from '../../validators';
import type { Subscription } from 'rxjs';
import type { FieldState, IField } from '../interfaces';
import type { CancelableSubscription, StateWithChanges } from '../../shared';

export type FieldConstructorParams<T extends string, S, U extends boolean> = {
  name: T;
  defaultValue: S;
  id?: string;
  transient?: U;
  validators?: Array<IValidator<S>>;
  validatorTemplates?: Array<ValidatorTemplate<S>>;
  asyncValidators?: Array<IAsyncValidator<S>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<S>>;
  pendingMessage?: string;
  delayAsyncValidatorExecution?: number;
};

export class Field<T extends string, S, U extends boolean = false>
  implements IField<T, S, U>
{
  public readonly name: T;
  public readonly id: string;
  public readonly transient: U;
  protected defaultValue: S;
  protected validatorSuite: CombinedValidatorSuite<S>;
  protected stateManager: StateManager<FieldState<S>>;
  protected validatorSuiteSubscription?: CancelableSubscription;

  public get state(): StateWithChanges<FieldState<S>> {
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
    delayAsyncValidatorExecution,
  }: FieldConstructorParams<T, S, U>) {
    this.name = name;
    this.id = id ?? this.name;
    this.transient = !!transient as U;
    this.defaultValue = defaultValue;

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

    const initialState: FieldState<S> = {
      ...syncResult,
      submitted: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
    };

    this.stateManager = new StateManager<FieldState<S>>(initialState);

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.stateManager.updateProperties({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      });
    });
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
    this.stateManager.updateProperties({ submitted: true });
  }

  public reset(): void {
    this.validatorSuiteSubscription?.unsubscribeAndCancel();

    const { syncResult, observableResult } = this.validatorSuite.validate(
      this.defaultValue,
    );

    const initialState: FieldState<S> = {
      ...syncResult,
      submitted: false,
      isInFocus: this.state.isInFocus,
      hasBeenBlurred: false,
      hasBeenModified: false,
    };

    this.stateManager.updateProperties(initialState);

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.stateManager.updateProperties({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      });
    });
  }

  protected getNonPendingMessages(): Message[] {
    return this.state.messages.filter(
      message => message.validity !== Validity.Pending,
    );
  }
}
