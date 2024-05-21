import type { Subscription } from 'rxjs';

export interface Stateful<T = unknown> {
  state: T;
  subscribeToState(cb: (state: T) => void): Subscription;
}
