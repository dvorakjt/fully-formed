import { AbstractSubForm } from './abstract-subform';
import type { Subscription } from 'rxjs';
import type { ExcludableFormElement } from '../../interfaces';
import type { ExcludableState } from '../../../shared';
import type { FormConstituents, FormState } from '../../types';

/**
 * Defines the structure of an excludable sub-form and maintains its state. This
 * type of sub-form may be excluded from the value of its parent form.
 *
 * @typeParam Name - A string literal representing the name of the form.
 *
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 *
 * @typeParam Transient - Represents whether or not the value of the sub-form
 * will be included in the value of its parent form.
 */
export abstract class AbstractExcludableSubForm<
    Name extends string,
    Constituents extends FormConstituents,
    Transient extends boolean,
  >
  extends AbstractSubForm<Name, Constituents, Transient>
  implements ExcludableFormElement
{
  public abstract state: FormState<Constituents> & ExcludableState;
  /**
   * Executes a callback function whenever the state of the form changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * form changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(
    cb: (state: FormState<Constituents> & ExcludableState) => void,
  ): Subscription;
  /**
   * Sets the exclude property of the state of the form to true or false.
   *
   * @param exclude - A boolean property representing whether or not to
   * exclude the value of the form from that of its parent form.
   */
  public abstract setExclude(exclude: boolean): void;
  /**
   * Resets the `confirmationAttempted` property of the form and the `exclude`
   * property of the state of the form, and calls the `reset()` methods of each
   * of its form elements.
   */
  public abstract reset(): void;
}
