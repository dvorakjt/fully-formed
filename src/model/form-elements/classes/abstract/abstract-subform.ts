import { AbstractForm } from './abstract-form';
import type { PossiblyTransient } from '../../../shared';
import type { FormConstituents } from '../../types';

export abstract class AbstractSubForm<
    Name extends string,
    Constituents extends FormConstituents,
    Transient extends boolean,
  >
  extends AbstractForm<Name, Constituents>
  implements PossiblyTransient<Transient>
{
  public abstract transient: Transient;
}
