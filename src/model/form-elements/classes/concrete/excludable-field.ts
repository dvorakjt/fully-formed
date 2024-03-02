import { AbstractExcludableField } from '..';
import {
  CombinedValidatorSuite,
  type AbstractCombinedValidatorSuite,
} from '../../../validators';
import {
  StateManager,
  Validity,
  type AbstractStateManager,
  type Message,
} from '../../../state';
import {
  StatefulArrayReducer,
  type AbstractStatefulArrayReducer,
} from '../../../reducers';
import type { Subscription } from 'rxjs';
import type {
  AbstractFieldGroup,
  FieldGroupMembers,
} from '../../../field-groups';
import type {
  ControlledExcludableFieldState,
  ExcludableFieldConstructorArgs,
  ExcludableFieldControlFn,
  ExcludableFieldState,
  FormElement,
} from '../../types';

export class ExcludableField<
  Name extends string,
  Value,
  Transient extends boolean,
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
  > = [],
> extends AbstractExcludableField<Name, Value, Transient> {
  public readonly name: Name;
  public readonly id: string;
  public readonly transient: Transient;
  private defaultValue: Value;
  private focusedByDefault: boolean;
  private visitedByDefault: boolean;
  private modifiedByDefault: boolean;
  private excludeByDefault: boolean;
  private controlFn?: ExcludableFieldControlFn<Controllers, Value>;
  private validatorSuite: AbstractCombinedValidatorSuite<Value>;
  private stateManager: AbstractStateManager<ExcludableFieldState<Value>>;
  private controllerReducer?: AbstractStatefulArrayReducer<Controllers>;
  private validatorSuiteSubscription?: Subscription;

  public get state(): ExcludableFieldState<Value> {
    return this.stateManager.state;
  }

  private set state(state: ExcludableFieldState<Value>) {
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
    excludeByDefault,
  }: ExcludableFieldConstructorArgs<Name, Value, Transient, Controllers>) {
    super();
    this.name = name;
    this.id = id ?? this.name;
    this.transient = !!transient as Transient;
    this.defaultValue = defaultValue;
    this.focusedByDefault = !!focusedByDefault;
    this.visitedByDefault = !!visitedByDefault;
    this.modifiedByDefault = !!modifiedByDefault;
    this.excludeByDefault = !!excludeByDefault;
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
    const initialState: ExcludableFieldState<Value> = {
      ...syncResult,
      focused: this.focusedByDefault,
      visited: this.visitedByDefault,
      modified: this.modifiedByDefault,
      exclude: this.excludeByDefault,
    };
    this.stateManager = new StateManager<ExcludableFieldState<Value>>(
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

  public subscribeToState(
    cb: (state: ExcludableFieldState<Value>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
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

  public setExclude(exclude: boolean): void {
    this.setPartialState({ exclude });
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
    const initialState: ExcludableFieldState<Value> = {
      ...syncResult,
      focused: this.focusedByDefault,
      visited: this.visitedByDefault,
      modified: this.modifiedByDefault,
      exclude: this.excludeByDefault,
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
    partialState: Partial<ExcludableFieldState<Value>>,
  ): void {
    this.state = { ...this.state, ...partialState };
  }

  private applyControlledState(
    partialState: ControlledExcludableFieldState<Value> | undefined,
  ): void {
    if (!partialState) return;
    if ('value' in partialState) {
      this.validatorSuiteSubscription?.unsubscribe();
    }
    this.setPartialState(partialState);
  }
}
