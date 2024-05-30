import { Subject, type Subscription } from 'rxjs';
import { deepEquals } from '../../utils';
import type { Stateful, StateWithChanges } from '../interfaces';

export class StateManager<T extends object>
  implements Stateful<StateWithChanges<T>>
{
  private _state: T;
  private _changes: Set<keyof T>;
  private stateChanges: Subject<StateWithChanges<T>> = new Subject<
    StateWithChanges<T>
  >();

  public get state(): StateWithChanges<T> {
    return {
      ...this._state,
      didPropertyChange: (prop: keyof T) => this._changes.has(prop),
    };
  }

  private set state(state: T) {
    this._state = state;
    this.stateChanges.next(this.state);
  }

  public constructor(initialState: T) {
    this._changes = new Set<keyof T>();
    this._state = {
      ...initialState,
    };
  }

  public subscribeToState(
    cb: (state: StateWithChanges<T>) => void,
  ): Subscription {
    return this.stateChanges.subscribe(cb);
  }

  public updateProperties(props: Partial<T>): void {
    const changes = new Set<string>();

    for (const key of Object.keys(props)) {
      if (!deepEquals(props[key as keyof T], this._state[key as keyof T])) {
        changes.add(key);
      }
    }

    this._changes = changes as Set<keyof T>;

    this.state = {
      ...this._state,
      ...props,
    };
  }
}
