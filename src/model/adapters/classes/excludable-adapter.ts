import {
  StateManager,
  type StateWithChanges,
  type Excludable,
  type Validated,
  type ValidatedState,
  type ExcludableState,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { IAdapter } from '../interfaces';

/**
 * An object containing the properties `value` and `exclude`. An object of this
 * type must be returned by the `adaptFn` provided to the constructor of an
 * {@link ExcludableAdapter}. The value will be included in the value of the
 * parent form provided that `exclude` is `false`.
 */
type AdaptFnReturnType<T> = {
  value: T;
  exclude: boolean;
};

/**
 * A function that receives the state of an instance of a class that implements
 * the {@link Validated} interface and returns an object of type
 * {@link AdaptFnReturnType} derived from that state.
 */
type ExcludableAdaptFn<T extends Validated<unknown>, U> = (
  sourceState: T['state'],
) => AdaptFnReturnType<U>;

/**
 * A configuration object provided to the constructor of an
 * {@link ExcludableAdapter} in order to instantiate it.
 */
type ExcludableAdapterConstructorParams<
  T extends string,
  U extends Validated<unknown>,
  V,
> = {
  /**
   * The name given to the value produced by the adapter within the value of
   * an enclosing form.
   *
   * @remarks
   * This name should be unique amongst all adapters and non-transient fields.
   * Transient fields and adapters may share the same name, allowing you to
   * effectively "shadow" a transient field (i.e. transform its value, type, etc.
   * while preserving is name).
   */
  name: T;
  /**
   * The source whose value should be transformed by the adapter. This can
   * be a field, group, or an instance of any class that implements
   * the {@link Validated} interface.
   */
  source: U;
  /**
   * A function that will be called by the adapter when it is initialized as
   * well as any time the state of its source changes. The function receives the
   * source's state and produces an object containing the properties `value` and
   * `exclude`.
   */
  adaptFn: ExcludableAdaptFn<U, V>;
};

/**
 * Transforms the state of a field, group, or other form element into an object
 * containing a `value` property and an `exclude` property. The value will be
 * included in the value of the parent form provided that `exclude` is `false`.
 *
 * @example
 * ```
 * import {
 *   ExcludableAdapter,
 *   FormTemplate,
 *   Field,
 *   ControlledExcludableField,
 *   Group,
 *   FormFactory,
 *   type TransientField,
 *   type NonTransientField,
 *   type Excludable,
 *   type IGroup,
 * } from "fully-formed";
 *
 * class OptionalInfoTemplate extends FormTemplate {
 *   public readonly fields: [
 *     TransientField<"hasPreviousName", boolean>,
 *     NonTransientField<"prevFirstName", string> & Excludable,
 *     NonTransientField<"prevMiddleName", string> & Excludable,
 *     NonTransientField<"prevLastName", string> & Excludable
 *   ];
 *
 *   public readonly groups: [
 *     IGroup<
 *       "prevNameGroup",
 *       [
 *         NonTransientField<"prevFirstName", string> & Excludable,
 *         NonTransientField<"prevMiddleName", string> & Excludable,
 *         NonTransientField<"prevLastName", string> & Excludable
 *       ]
 *     >
 *   ];
 *
 *   public readonly adapters: [
 *     ExcludableAdapter<"prevFullName", this["groups"][0], string>
 *   ];
 *
 *   constructor() {
 *     super();
 *
 *     const hasPreviousName = new Field({
 *       name: "hasPreviousName",
 *       defaultValue: false,
 *       transient: true,
 *     });
 *
 *     this.fields = [
 *       hasPreviousName,
 *       new ControlledExcludableField({
 *         name: "prevFirstName",
 *         controller: hasPreviousName,
 *         initFn: (controllerState) => {
 *           const hasPreviousName = controllerState.value;
 *           return {
 *             value: "",
 *             exclude: !hasPreviousName,
 *           };
 *         },
 *         controlFn: (controllerState) => {
 *           const hasPreviousName = controllerState.value;
 *           return {
 *             exclude: !hasPreviousName,
 *           };
 *         },
 *       }),
 *       new ControlledExcludableField({
 *         name: "prevMiddleName",
 *         controller: hasPreviousName,
 *         initFn: (controllerState) => {
 *           const hasPreviousName = controllerState.value;
 *           return {
 *             value: "",
 *             exclude: !hasPreviousName,
 *           };
 *         },
 *         controlFn: (controllerState) => {
 *           const hasPreviousName = controllerState.value;
 *           return {
 *             exclude: !hasPreviousName,
 *           };
 *         },
 *       }),
 *       new ControlledExcludableField({
 *         name: "prevLastName",
 *         controller: hasPreviousName,
 *         initFn: (controllerState) => {
 *           const hasPreviousName = controllerState.value;
 *           return {
 *             value: "",
 *             exclude: !hasPreviousName,
 *           };
 *         },
 *         controlFn: (controllerState) => {
 *           const hasPreviousName = controllerState.value;
 *           return {
 *             exclude: !hasPreviousName,
 *           };
 *         },
 *       }),
 *     ];
 *
 *     this.groups = [
 *       new Group({
 *         name: "prevNameGroup",
 *         members: [this.fields[1], this.fields[2], this.fields[3]],
 *       }),
 *     ];
 *
 *     this.adapters = [
 *       new ExcludableAdapter({
 *         name: "prevFullName",
 *         source: this.groups[0],
 *         adaptFn: ({ value }) => {
 *           const firstName = value.prevFirstName
 *             ? capitalize(value.prevFirstName.trim())
 *             : "";
 *
 *           const middleInitial = value.prevMiddleName
 *             ? value.prevMiddleName.slice(0, 1).toUpperCase()
 *             : "";
 *
 *           const lastName = value.prevLastName
 *             ? capitalize(value.prevLastName.trim())
 *             : "";
 *
 *           return {
 *             value: `${firstName} ${middleInitial}. ${lastName}`,
 *             exclude: !!value.prevFirstName,
 *           };
 *         },
 *       }),
 *     ];
 *   }
 * }
 *
 * export const OptionalInfoForm = FormFactory.createForm(OptionalInfoTemplate);
 *
 * function capitalize(name: string) {
 *   return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
 * }
 * ```
 */
export class ExcludableAdapter<
    T extends string,
    U extends Validated<unknown>,
    V,
  >
  implements IAdapter<T, V>, Excludable
{
  public readonly name: T;
  private source: U;
  private adaptFn: ExcludableAdaptFn<U, V>;
  private stateManager: StateManager<ValidatedState<V> & ExcludableState>;

  public get state(): StateWithChanges<ValidatedState<V> & ExcludableState> {
    return this.stateManager.state;
  }

  public constructor({
    name,
    source,
    adaptFn,
  }: ExcludableAdapterConstructorParams<T, U, V>) {
    this.name = name;
    this.source = source;
    this.adaptFn = adaptFn;

    this.stateManager = new StateManager<ValidatedState<V> & ExcludableState>({
      ...this.adaptFn(this.source.state),
      validity: this.source.state.validity,
    });

    this.subscribeToSource();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<ValidatedState<V> & ExcludableState>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private subscribeToSource(): void {
    this.source.subscribeToState(state => {
      this.stateManager.updateProperties({
        ...this.adaptFn(state),
        validity: state.validity,
      });
    });
  }
}
