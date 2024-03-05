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
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type { Subscription } from 'rxjs';
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
  const Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  > = [],
> extends AbstractField<Name, Value, Transient> {
  public readonly name: Name;
  public readonly id: string;
  public readonly transient: Transient;
  private defaultValue: Value;
  private focusedByDefault: boolean;
  private visitedByDefault: boolean;
  private modifiedByDefault: boolean;
  private controlFn?: FieldControlFn<Controllers, Value>;
  private validatorSuite: AbstractCombinedValidatorSuite<Value>;
  private stateManager: AbstractStateManager<FieldState<Value>>;
  private controllerReducer?: AbstractStatefulArrayReducer<Controllers>;
  private validatorSuiteSubscription?: Subscription;

  public get state(): FieldState<Value> {
    return this.stateManager.state;
  }

  private set state(state: FieldState<Value>) {
    this.stateManager.state = state;
  }

  public constructor({
    name,
    id,
    transient,
    defaultValue,
    focusedByDefault,
    visitedByDefault,
    modifiedByDefault,
    validators,
    validatorTemplates,
    asyncValidators,
    asyncValidatorTemplates,
    pendingMessage,
    controlledBy,
  }: FieldConstructorArgs<Name, Value, Transient, Controllers>) {
    super();
    this.name = name;
    this.id = id ?? this.name;
    this.transient = !!transient as Transient;
    this.defaultValue = defaultValue;
    this.focusedByDefault = !!focusedByDefault;
    this.visitedByDefault = !!visitedByDefault;
    this.modifiedByDefault = !!modifiedByDefault;
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
    const initialState: FieldState<Value> = {
      ...syncResult,
      focused: this.focusedByDefault,
      visited: this.visitedByDefault,
      modified: this.modifiedByDefault,
    };
    this.stateManager = new StateManager<FieldState<Value>>(initialState);
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
    cb: (state: FieldState<Value>) => void,
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
    const initialState: FieldState<Value> = {
      ...syncResult,
      focused: this.focusedByDefault,
      visited: this.visitedByDefault,
      modified: this.modifiedByDefault,
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

  private setPartialState(partialState: Partial<FieldState<Value>>): void {
    this.state = { ...this.state, ...partialState };
  }

  private applyControlledState(
    partialState: ControlledFieldState<Value> | undefined,
  ): void {
    if (!partialState) return;
    if ('value' in partialState) {
      this.validatorSuiteSubscription?.unsubscribe();
    }
    this.setPartialState(partialState);
  }
}
