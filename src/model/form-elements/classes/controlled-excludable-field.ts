import { ExcludableField, type ExcludableFieldState } from './excludable-field';
import type {
  Stateful,
  ValidatedState,
  MessageBearerState,
  ExcludableState,
} from '../../shared';
import type {
  IValidator,
  ValidatorTemplate,
  IAsyncValidator,
  AsyncValidatorTemplate,
} from '../../validators';

type ControlledState<T> =
  | (ValidatedState<T> & MessageBearerState & ExcludableState)
  | (ValidatedState<T> & MessageBearerState)
  | ExcludableState;

type ControlFn<T extends Stateful, V> = (
  controllerState: T['state'],
  ownState: ExcludableFieldState<V>,
) => ControlledState<V> | void;

type ControlledExcludableFieldConstructorParams<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean,
> = {
  name: T;
  defaultValue: S;
  controller: U;
  controlFn: ControlFn<U, S>;
  id?: string;
  transient?: V;
  validators?: Array<IValidator<S>>;
  validatorTemplates?: Array<ValidatorTemplate<S>>;
  asyncValidators?: Array<IAsyncValidator<S>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<S>>;
  pendingMessage?: string;
  delayAsyncValidatorExecution?: number;
  excludeByDefault?: boolean;
};

export class ControlledExcludableField<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean = false,
> extends ExcludableField<T, S, V> {
  private controller: U;
  private controlFn: ControlFn<U, S>;

  public constructor(
    params: ControlledExcludableFieldConstructorParams<T, S, U, V>,
  ) {
    super(params);
    this.controller = params.controller;
    this.controlFn = params.controlFn;
    this.applyControlFn(this.controller.state);
    this.subscribeToController();
  }

  public reset(): void {
    super.reset();
    this.applyControlFn(this.controller.state);
  }

  private subscribeToController(): void {
    this.controller.subscribeToState(state => {
      this.applyControlFn(state);
    });
  }

  private applyControlFn(controllerState: U['state']): void {
    const dictatedState = this.controlFn(controllerState, this.state);
    if (!dictatedState) return;

    if (
      this.validatorSuiteSubscription &&
      this.isValidatedState(dictatedState)
    ) {
      this.validatorSuiteSubscription.unsubscribeAndCancel();
    }

    this.state = dictatedState;
  }

  private isValidatedState(
    state: ControlledState<S>,
  ): state is ValidatedState<S> & MessageBearerState {
    return 'value' in state && 'validity' in state && 'messages' in state;
  }
}
