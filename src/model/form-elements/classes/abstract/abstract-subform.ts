import type { Subscription } from 'rxjs';
import type { PossiblyTransient } from '../../../shared';
import type { FormConstituents, FormState } from '../../types';
import { AbstractForm } from './abstract-form';

export abstract class AbstractSubForm<
    Name extends string,
    Constituents extends FormConstituents,
    Transient extends boolean,
  >
  extends AbstractForm<Name, Constituents>
  implements PossiblyTransient<Transient>
{
  public abstract transient: Transient;
  public abstract state: FormState<
    Constituents['formElements'],
    Constituents['adapters']
  >;
  public abstract subscribeToState(
    cb: (
      state: FormState<Constituents['formElements'], Constituents['adapters']>,
    ) => void,
  ): Subscription;
}
