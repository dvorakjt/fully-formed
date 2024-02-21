import { AbstractField } from '../abstract';
import {
  Validity,
  StateManager,
  type AbstractStateManager,
  type Message,
} from '../../../state';
import type {
  ControlledFieldState,
  FieldConstructorArgs,
  FieldControlFn,
  FieldState,
  FormElement,
} from '../../types';
import type {
  AbstractFieldGroup,
  FieldGroupMembers,
} from '../../../field-groups';
import type { Subscription } from 'rxjs';
import type { Exclude } from '../../../shared';
import {
  CombinedValidatorSuite,
  type AbstractCombinedValidatorSuite,
} from '../../../validators';
import {
  StatefulArrayReducer,
  type AbstractStatefulArrayReducer,
} from '../../../reducers';

export class Field<
  Name extends string,
  Value,
  Transient extends boolean = false,
  Excludable extends boolean = false,
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
  > = [],
> extends AbstractField<Name, Value, Transient, Excludable> {
  public readonly name: Name;
  public readonly id: string;
  public readonly transient: Transient;
  public readonly excludable: Excludable;
  private defaultValue: Value;
  private focusedByDefault: boolean;
  private visitedByDefault: boolean;
  private modifiedByDefault: boolean;
  private excludedByDefault: Exclude<Excludable>;
  private controlFn?: FieldControlFn<Controllers, Value, Excludable>;
  private validatorSuite: AbstractCombinedValidatorSuite<Value>;
  private stateManager: AbstractStateManager<FieldState<Value, Excludable>>;
  private controllerReducer?: AbstractStatefulArrayReducer<Controllers>;
  private validatorSuiteSubscription?: Subscription;

  public get state(): FieldState<Value, Excludable> {
    return this.stateManager.state;
  }

  private set state(state: FieldState<Value, Excludable>) {
    this.stateManager.state = state;
  }

  public get exclude(): Exclude<Excludable> {
    return this.stateManager.state.exclude;
  }

  public set exclude(exclude: Exclude<Excludable>) {
    this.setPartialState({ exclude });
  }

  public constructor({
    name,
    id,
    transient,
    excludable,
    defaultValue,
    focusedByDefault,
    visitedByDefault,
    modifiedByDefault,
    excludedByDefault,
    validators,
    validatorTemplates,
    asyncValidators,
    asyncValidatorTemplates,
    pendingMessage,
    controlledBy,
  }: FieldConstructorArgs<Name, Value, Transient, Excludable, Controllers>) {
    super();
    this.name = name;
    this.id = id ?? this.name;
    this.transient = !!transient as Transient;
    this.excludable = !!excludable as Excludable;
    (this.defaultValue = defaultValue),
      (this.focusedByDefault = !!focusedByDefault);
    this.visitedByDefault = !!visitedByDefault;
    this.modifiedByDefault = !!modifiedByDefault;
    this.excludedByDefault = !!excludedByDefault as Exclude<Excludable>;
    this.validatorSuite = new CombinedValidatorSuite<Value>({
      validators,
      validatorTemplates,
      asyncValidators,
      asyncValidatorTemplates,
      pendingMessage,
    });
    const { syncResult, observableResult } = this.validatorSuite.validate(
      this.defaultValue,
    );
    const initialState: FieldState<Value, Excludable> = {
      ...syncResult,
      focused: this.focusedByDefault,
      visited: this.visitedByDefault,
      modified: this.modifiedByDefault,
      exclude: this.excludedByDefault,
    };
    this.stateManager = new StateManager<FieldState<Value, Excludable>>(
      initialState,
    );
    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.setPartialState({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      });
    });
    if (controlledBy) {
      this.controlFn = controlledBy.controlFn;
      this.controllerReducer = new StatefulArrayReducer<Controllers>({
        members: controlledBy.controllers,
      });
      this.applyControlledState(
        this.controlFn(this.controllerReducer.state, this.state),
      );
      this.controllerReducer.subscribeToState(state => {
        this.controlFn &&
          this.applyControlledState(this.controlFn(state, this.state));
      });
    }
  }

  public setValue(value: Value): void {
    this.validatorSuiteSubscription?.unsubscribe();
    const { syncResult, observableResult } =
      this.validatorSuite.validate(value);
    this.setPartialState({ ...syncResult, modified: true });
    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.setPartialState({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      });
    });
  }

  public subscribeToState(
    cb: (state: FieldState<Value, Excludable>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  public focus(): void {
    this.setPartialState({ focused: true });
  }

  public visit(): void {
    this.setPartialState({ visited: true });
  }

  public reset(): void {
    const { syncResult, observableResult } = this.validatorSuite.validate(
      this.defaultValue,
    );
    const initialState: FieldState<Value, Excludable> = {
      ...syncResult,
      focused: this.focusedByDefault,
      visited: this.visitedByDefault,
      modified: this.modifiedByDefault,
      exclude: this.excludedByDefault,
    };
    this.state = initialState;
    this.validatorSuiteSubscription = observableResult?.subscribe(result => {
      this.setPartialState({
        ...result,
        messages: [...this.getNonPendingMessages(), ...result.messages],
      });
    });
    if (this.controlFn && this.controllerReducer) {
      this.applyControlledState(
        this.controlFn(this.controllerReducer.state, this.state),
      );
    }
  }

  private getNonPendingMessages(): Message[] {
    return this.state.messages.filter(
      message => message.validity !== Validity.Pending,
    );
  }

  private setPartialState(
    partialState: Partial<FieldState<Value, Excludable>>,
  ): void {
    this.state = { ...this.state, ...partialState };
  }

  private applyControlledState(
    partialState: ControlledFieldState<Value, Excludable>,
  ): void {
    if ('value' in partialState) {
      this.validatorSuiteSubscription?.unsubscribe();
    }
    this.setPartialState(partialState);
  }
}
