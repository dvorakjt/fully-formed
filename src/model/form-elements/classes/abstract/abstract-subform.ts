import type { Subscription } from 'rxjs';
import type {
  ExcludableState,
  Exclude,
  PossiblyExcludable,
  PossiblyTransient,
} from '../../../shared';
import type { FormConstituents, FormState } from '../../types';
import { AbstractForm } from './abstract-form';

export abstract class AbstractSubForm<
    Name extends string,
    Constituents extends FormConstituents,
    Transient extends boolean,
    Excludable extends boolean,
  >
  extends AbstractForm<Name, Constituents>
  implements PossiblyTransient<Transient>, PossiblyExcludable<Excludable>
{
  public abstract transient: Transient;
  public abstract excludable: Excludable;
  public abstract exclude: Exclude<Excludable>;
  public abstract state: FormState<
    Constituents['formElements'],
    Constituents['adapters']
  > &
    ExcludableState<Excludable>;
  public abstract subscribeToState(
    cb: (
      state: FormState<Constituents['formElements'], Constituents['adapters']> &
        ExcludableState<Excludable>,
    ) => void,
  ): Subscription;
}
