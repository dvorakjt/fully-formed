import { AbstractSubForm } from './abstract-subform';
import type { Subscription } from 'rxjs';
import type { ExcludableFormElement } from '../../interfaces';
import type { ExcludableState } from '../../../shared';
import type { FormConstituents, FormState } from '../../types';

export abstract class AbstractExcludableSubForm<
    Name extends string,
    Constituents extends FormConstituents,
    Transient extends boolean,
  >
  extends AbstractSubForm<Name, Constituents, Transient>
  implements ExcludableFormElement
{
  public abstract state: FormState<Constituents> & ExcludableState;
  public abstract subscribeToState(
    cb: (state: FormState<Constituents> & ExcludableState) => void,
  ): Subscription;
  public abstract setExclude(exclude: boolean): void;
}
