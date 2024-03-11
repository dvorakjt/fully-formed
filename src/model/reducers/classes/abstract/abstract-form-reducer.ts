import type { Subscription } from 'rxjs';
import type { Stateful } from '../../../shared';
import type { FormReducerState } from '../../types';
import type { FormConstituents } from '../../../form-elements';

export abstract class AbstractFormReducer<Constituents extends FormConstituents>
  implements Stateful<FormReducerState<Constituents>>
{
  public abstract state: FormReducerState<Constituents>;
  public abstract subscribeToState(
    cb: (state: FormReducerState<Constituents>) => void,
  ): Subscription;
}
