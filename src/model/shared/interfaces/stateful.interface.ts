import type { Subscription } from 'rxjs';

export type StateWithChanges<T extends object> = T & {
  didPropertyChange(prop: keyof T): boolean;
};

export interface Stateful<T extends object = object> {
  state: StateWithChanges<T>;
  subscribeToState(cb: (state: StateWithChanges<T>) => void): Subscription;
}
