import { StateManager, Validity, type Message } from '../../shared';
import {
  CombinedValidatorSuite,
  type IValidator,
  type ValidatorTemplate,
  type IAsyncValidator,
  type AsyncValidatorTemplate,
} from '../../validators';
import type { Subscription } from 'rxjs';
import type { IField, FieldState, Resettable } from '../interfaces';

type FieldConstructorParams<T extends string, S, U extends boolean> = {
  name: T;
  defaultValue: S;
  id?: string;
  transient?: U;
  validators?: Array<IValidator<S>>;
  validatorTemplates?: Array<ValidatorTemplate<S>>;
  asyncValidators?: Array<IAsyncValidator<S>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<S>>;
  pendingMessage?: string;
};

export class Field<T extends string, S, U extends boolean = false>
  implements IField<T, S, U>, Resettable
{
  public readonly name: T;
  public readonly id: string;
  public readonly transient: U;
  protected defaultValue: S;
  protected validatorSuite: CombinedValidatorSuite<S>;
  protected stateManager: StateManager<FieldState<S>>;
  protected validatorSuiteSubscription?: Subscription;

  public get state(): FieldState<S> {
    return this.stateManager.state;
  }

  protected set state(state: Partial<FieldState<S>>) {
    this.stateManager.state = {
      ...this.state,
      ...state,
    };
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
      this.state = {
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      };
    });
  }

  public setValue(value: S): void {
    this.validatorSuiteSubscription?.unsubscribe();

    const { syncResult, observableResult } =
      this.validatorSuite.validate(value);

    this.state = { ...syncResult, hasBeenModified: true };

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.state = {
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      };
    });
  }

  public subscribeToState(cb: (state: FieldState<S>) => void): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  public focus(): void {
    this.state = {
      isInFocus: true,
    };
  }

  public blur(): void {
    this.state = {
      isInFocus: false,
      hasBeenBlurred: true,
    };
  }

  public cancelFocus(): void {
    this.state = {
      isInFocus: false,
    };
  }

  public setSubmitted(): void {
    this.state = { submitted: true };
  }

  public reset(): void {
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

    this.state = initialState;

    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.state = {
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      };
    });
  }

  private getNonPendingMessages(): Message[] {
    return this.state.messages.filter(
      message => message.validity !== Validity.Pending,
    );
  }
}
