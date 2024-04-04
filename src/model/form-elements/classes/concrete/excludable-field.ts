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
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type {
  ControlledExcludableFieldState,
  ExcludableFieldConstructorArgs,
  ExcludableFieldControlFn,
  ExcludableFieldState,
  FormElement,
} from '../../types';

/**
 * Represents a field within a form. This type of field may be excluded
 * from the value of a form. If excluded, it will not impact the
 * validity of the form, either.
 *
 * @typeParam Name - A string literal which will be the key given to the field
 * within the `formElements` property of its parent form, as well as to the
 * value of the field (if non-transient) within a {@link FormValue} object.
 *
 * @typeParam Value - The type of value the field will contain.
 *
 * @typeParam Transient - Represents whether or not the value of the field
 * will be included in the value of its parent form.
 *
 * @typeParam Controllers - A readonly array of form elements and/or groups to
 * which the field will subscribe. If provided, the states of these entities
 * will control the state of the field.
 */
export class ExcludableField<
  Name extends string,
  Value,
  Transient extends boolean = false,
  const Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
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

  /**
   * Executes a callback function whenever the state of the field changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * field changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToState(
    cb: (state: ExcludableFieldState<Value>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  /**
   * Calls validators against the provided value, and then
   * sets the `value`, `validity`, and `messages` properties of the state
   * of the field based on the results of those validators.
   *
   * @param value - The value to validate and apply to the `value` property
   * of the state of the field.
   */
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

  /**
   * Sets the exclude property of the state of the field to true or false.
   *
   * @param exclude - A boolean property representing whether or not to
   * exclude the value of the field from that of its parent form.
   */
  public setExclude(exclude: boolean): void {
    this.setPartialState({ exclude });
  }

  /**
   * Sets the `focused` property of the state of the field to true.
   */
  public focus(): void {
    this.setPartialState({ focused: true });
  }

  /**
   * Sets the `visited` property of the state of the field to true.
   */
  public visit(): void {
    this.setPartialState({ visited: true });
  }

  /**
   * Calls validators against the default value of the field and sets the
   * `value`, `validity`, and `messages` properties of the state of the
   * field accordingly.
   *
   * If `controllers` and a `controlFn` were provided, calls that function
   * with the states of its controllers.
   *
   * Also resets the `focused`, `visited`, `modified`, and `exclude`
   * properties of the state of the field.
   */
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
