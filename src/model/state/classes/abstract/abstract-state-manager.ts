import type { Subscription } from 'rxjs';
import type { Stateful } from '../../../shared';

export abstract class AbstractStateManager<T> implements Stateful<T> {
  public abstract state: T;
  public abstract subscribeToState(cb: (state: T) => void): Subscription;
}
