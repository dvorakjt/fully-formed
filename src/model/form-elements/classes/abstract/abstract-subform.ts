import { AbstractForm } from './abstract-form';
import type { Nameable, PossiblyTransient } from '../../../shared';
import type { FormConstituents } from '../../types';

/**
 * Defines the structure of a sub-form and maintains its state.
 *
 * @typeParam Name - A string literal representing the name of the form.
 *
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 *
 * @typeParam Transient - Represents whether or not the value of the sub-form
 * will be included in the value of its parent form.
 */
export abstract class AbstractSubForm<
    Name extends string,
    Constituents extends FormConstituents,
    Transient extends boolean,
  >
  extends AbstractForm<Constituents>
  implements Nameable<Name>, PossiblyTransient<Transient>
{
  public abstract name: Name;
  public abstract id: string;
  public abstract transient: Transient;
}
