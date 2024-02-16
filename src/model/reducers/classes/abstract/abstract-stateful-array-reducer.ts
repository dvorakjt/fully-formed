import type { Subscription } from 'rxjs';
import type { Stateful } from '../../../shared';
import type { StatefulArrayStates } from '../../types';

export abstract class AbstractStatefulArrayReducer<
  T extends ReadonlyArray<Stateful<unknown>>,
> implements Stateful<StatefulArrayStates<T>>
{
  public abstract state: StatefulArrayStates<T>;
  public abstract subscribeToState(
    cb: (state: StatefulArrayStates<T>) => void,
  ): Subscription;
}
