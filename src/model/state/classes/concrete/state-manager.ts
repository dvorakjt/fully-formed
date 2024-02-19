import { AbstractStateManager } from '../abstract';
import { Subject, type Subscription } from 'rxjs';

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

  public constructor(state: T) {
    super();
    this._state = state;
  }

  public subscribeToState(cb: (state: T) => void): Subscription {
    return this.stateChanges.subscribe(cb);
  }
}
