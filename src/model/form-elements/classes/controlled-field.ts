import { Field } from './field';
import type {
  Stateful,
  ValidatedState,
  MessageBearerState,
} from '../../shared';
import type {
  IValidator,
  ValidatorTemplate,
  IAsyncValidator,
  AsyncValidatorTemplate,
} from '../../validators';
import type { FieldState } from '../interfaces';

type ControlledState<T> = ValidatedState<T> & MessageBearerState;

type ControlFn<T extends Stateful, V> = (
  controllerState: T['state'],
  ownState: FieldState<V>,
) => ControlledState<V> | void;

type ControlledFieldConstructorParams<
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
};

export class ControlledField<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean = false,
> extends Field<T, S, V> {
  private controller: U;
  private controlFn: ControlFn<U, S>;

  public constructor(params: ControlledFieldConstructorParams<T, S, U, V>) {
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

    if (this.validatorSuiteSubscription) {
      this.validatorSuiteSubscription.unsubscribeAndCancel();
    }

    this.state = dictatedState;
  }
}
