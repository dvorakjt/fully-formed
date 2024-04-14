import type { Subscription } from 'rxjs';
import type { Stateful } from '../../../shared';

/**
 * Maintains state and emits updates to subscribers when that state changes.
 *
 * @typeParam T - The type of value that will be held in its `state` property
 * and emitted to subscribers.
 */
export abstract class AbstractStateManager<T> implements Stateful<T> {
  public abstract state: T;
  /**
   * Executes a callback function whenever its `state` property changes.
   *
   * @param cb - The callback function to be executed when its `state` property
   * changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(cb: (state: T) => void): Subscription;
}
