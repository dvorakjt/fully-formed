import { AbstractStateManager } from '../abstract';
import { Subject, type Subscription } from 'rxjs';

/**
 * Maintains state and emits updates to subscribers when that state changes.
 *
 * @typeParam T - The type of value that will be held in its `state` property
 * and emitted to subscribers.
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
   * Executes a callback function whenever its `state` property changes.
   *
   * @param cb - The callback function to be executed when its `state` property
   * changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToState(cb: (state: T) => void): Subscription {
    return this.stateChanges.subscribe(cb);
  }
}
