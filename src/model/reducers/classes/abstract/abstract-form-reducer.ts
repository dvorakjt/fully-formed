import type { Subscription } from 'rxjs';
import type { Stateful } from '../../../shared';
import type { FormReducerState } from '../../types';

export abstract class AbstractFormReducer<Value extends Record<string, unknown>>
  implements Stateful<FormReducerState<Value>>
{
  public abstract state: FormReducerState<Value>;
  public abstract subscribeToState(
    cb: (state: FormReducerState<Value>) => void,
  ): Subscription;
}
