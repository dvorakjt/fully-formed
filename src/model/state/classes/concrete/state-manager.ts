import { AbstractStateManager } from '../abstract';
import { Subject, type Subscription } from 'rxjs';

/**
 * Stores state and emits changes to subscribers.
 */
export class StateManager<T> extends AbstractStateManager<T> {
  private _state: T;
  private stateChanges: Subject<T> = new Subject<T>();

  public set state(state: T) {
    this._state = state;
    this.stateChanges.next(this.state);
  }

  public get state(): T {
    return this._state;
  }

  /**
   * @param state - The default state for the instance.
   */
  public constructor(state: T) {
    super();
    this._state = state;
  }

  /**
   * Calls the provided callback function in response to any changes to `state`.
   *
   * @param cb - The callback function to be called when `state` has changed.
   * @returns - A {@link Subscription}.
   */
  public subscribeToState(cb: (state: T) => void): Subscription {
    return this.stateChanges.subscribe(cb);
  }
}
