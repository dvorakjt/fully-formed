import type { Subscription } from 'rxjs';

/**
 * Represents an entity that maintains state and which can emit updates to this
 * state to subscribers.
 * 
 * @typeParam State - The type of state maintained by the entity and emitted to
 * subscribers.
 */
export interface Stateful<State> {
  state: State;
  /**
   * Executes a callback function whenever the state of the entity changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * entity changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  subscribeToState(cb: (state: State) => void): Subscription;
}
