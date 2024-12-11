import {
  StateManager,
  type StateWithChanges,
  type Validated,
  type ValidatedState,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { IAdapter } from '../interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Field } from '../../form-elements';

/**
 * A function that receives the state of an instance of a class that implements
 * the {@link Validated} interface and returns a value derived from that state.
 */
type AdaptFn<T extends Validated<unknown>, U> = (sourceState: T['state']) => U;

/**
 * A configuration object provided to the constructor of the {@link Adapter}
 * class in order to instantiate it.
 */
type AdapterConstructorParams<
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
   * source's state and produces a new value.
   */
  adaptFn: AdaptFn<U, V>;
};

/**
 * Transforms the state of a field, group, or other form element into a value
 * which will be included in the value of the parent form.
 *
 * @example
 * ```
 * import {
 *   Adapter,
 *   FormTemplate,
 *   Field,
 *   Group,
 *   FormFactory
 * } from "fully-formed";
 *
 * class UserInfoTemplate extends FormTemplate {
 *   public readonly fields = [
 *     new Field({
 *       name: "firstName",
 *       defaultValue: "",
 *     }),
 *     new Field({
 *       name: "middleName",
 *       defaultValue: "",
 *     }),
 *     new Field({
 *       name: "lastName",
 *       defaultValue: "",
 *     }),
 *   ] as const;
 *
 *   public readonly groups = [
 *     new Group({
 *       name: "fullNameGroup",
 *       members: this.fields,
 *     }),
 *   ] as const;
 *
 *   // A new field called "fullName" will be available as a member of the
 *   // value of the form.
 *   public readonly adapters = [
 *     new Adapter({
 *       name: "fullName",
 *       source: this.groups[0],
 *       adaptFn: ({ value }) => {
 *         const firstName = capitalize(value.firstName.trim());
 *         const middleInitial = value.middleName.slice(0, 1).toUpperCase();
 *         const lastName = capitalize(value.lastName.trim());
 *         return `${firstName} ${middleInitial}. ${lastName}`;
 *       },
 *     }),
 *   ] as const;
 * }
 *
 * export const UserInfoForm = FormFactory.createForm(UserInfoTemplate);
 *
 * function capitalize(name: string) {
 *   return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
 * }
 *
 * ```
 */
export class Adapter<T extends string, U extends Validated<unknown>, V>
  implements IAdapter<T, V>
{
  public readonly name: T;
  private source: U;
  private adaptFn: AdaptFn<U, V>;
  private stateManager: StateManager<ValidatedState<V>>;

  public get state(): StateWithChanges<ValidatedState<V>> {
    return this.stateManager.state;
  }

  public constructor({
    name,
    source,
    adaptFn,
  }: AdapterConstructorParams<T, U, V>) {
    this.name = name;
    this.source = source;
    this.adaptFn = adaptFn;

    this.stateManager = new StateManager<ValidatedState<V>>({
      value: this.adaptFn(this.source.state),
      validity: this.source.state.validity,
    });

    this.subscribeToSource();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<ValidatedState<V>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private subscribeToSource(): void {
    this.source.subscribeToState(state => {
      this.stateManager.updateProperties({
        value: this.adaptFn(state),
        validity: state.validity,
      });
    });
  }
}
