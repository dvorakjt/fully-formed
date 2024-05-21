import { Subject, type Subscription } from 'rxjs';
import type { Stateful } from '../interfaces';

export class StateManager<T> implements Stateful<T> {
  private _state: T;
  private stateChanges: Subject<T> = new Subject<T>();

  public set state(state: T) {
    this._state = state;
    this.stateChanges.next(this.state);
  }

  public get state(): T {
    return this._state;
  }

  public constructor(state: T) {
    this._state = state;
  }

  public subscribeToState(cb: (state: T) => void): Subscription {
    return this.stateChanges.subscribe(cb);
  }
}
