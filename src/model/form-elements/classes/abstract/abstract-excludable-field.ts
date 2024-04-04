import { AbstractField } from './abstract-field';
import type { Subscription } from 'rxjs';
import type { ExcludableFormElement } from '../../interfaces';
import type { ExcludableState } from '../../../shared';
import type { FieldState } from '../../types';

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
 */
export abstract class AbstractExcludableField<
    Name extends string,
    Value,
    Transient extends boolean,
  >
  extends AbstractField<Name, Value, Transient>
  implements ExcludableFormElement
{
  public abstract state: FieldState<Value> & ExcludableState;
  /**
   * Executes a callback function whenever the state of the field changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * field changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(
    cb: (state: FieldState<Value> & ExcludableState) => void,
  ): Subscription;
  /**
   * Sets the exclude property of the state of the field to true or false.
   *
   * @param exclude - A boolean property representing whether or not to
   * exclude the value of the field from that of its parent form.
   */
  public abstract setExclude(exclude: boolean): void;
}
