import type { Subscription } from 'rxjs';
import type {
  Identifiable,
  Nameable,
  Stateful,
  PossiblyTransient,
  Resettable,
  Interactable,
} from '../../../shared';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FieldState, FormValue } from '../../types';

/**
 * Represents a field within a form. A user may interact with such
 * a field via HTML elements such as `<input>`, `<select>`, `<textarea>`, etc.
 *
 * @typeParam Name - A string literal which will be the key given to the field
 * within the `formElements` property of an enclosing form, as well as to the
 * value of the field (if non-transient) within a {@link FormValue} object.
 *
 * @typeParam Value - The type of value the field will contain.
 *
 * @typeParam Transient - Represents whether or not the value of the field
 * will be included in the value of an enclosing form.
 */
export abstract class AbstractField<
    Name extends string,
    Value,
    Transient extends boolean,
  >
  implements
    Nameable<Name>,
    Identifiable,
    Stateful<FieldState<Value>>,
    PossiblyTransient<Transient>,
    Interactable,
    Resettable
{
  public abstract name: Name;
  public abstract id: string;
  public abstract state: FieldState<Value>;
  public abstract transient: Transient;
  /**
   * Calls validators against the provided value, and then
   * sets the `value`, `validity`, and `messages` properties of the state
   * of the field based on the results of those validators.
   *
   * @param value - The value to validate and apply to the `value` property
   * of the state of the field.
   */
  public abstract setValue(value: Value): void;
  /**
   * Executes a callback function whenever the state of the field changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * field changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(
    cb: (state: FieldState<Value>) => void,
  ): Subscription;
  /**
   * Sets the `focused` property of the state of the field to true.
   */
  public abstract focus(): void;
  /**
   * Sets the `visited` property of the state of the field to true.
   */
  public abstract visit(): void;
  /**
   * Calls validators against the default value of the field and sets the
   * `value`, `validity`, and `messages` properties of the state of the
   * field accordingly. Also resets the `focused`,
   * `visited`, and `modified` properties of the state of the field.
   */
  public abstract reset(): void;
}
