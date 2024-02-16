import type { Subscription } from 'rxjs';

export interface Stateful<State> {
  state: State;
  subscribeToState(cb: (state: State) => void): Subscription;
}
