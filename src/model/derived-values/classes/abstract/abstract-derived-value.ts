import type { Subscription } from 'rxjs';
import type { Nameable } from '../../../shared';

/**
 * Represents a value that can be displayed to the user, used to determine how 
 * to render aspects of the UI, etc.
 * 
 * @typeParam Name - A string literal which will become the key given to the 
 * derived value in the derivedValues property of the enclosing form.
 * 
 * @typeParam Value - The type of value that the derived value will produce.
 */
export abstract class AbstractDerivedValue<Name extends string, Value>
  implements Nameable<Name>
{
  public abstract name: Name;
  public abstract value: Value;
  /**
   * Executes a callback function whenever the derived value changes.
   *
   * @param cb - The callback function to be executed when the derived value
   * changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToValue(cb: (value: Value) => void): Subscription;
}
