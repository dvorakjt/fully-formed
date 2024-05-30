import {
  StateManager,
  type StateWithChanges,
  type Validated,
  type ValidatedState,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { IAdapter } from '../interfaces';

type AdaptFn<T extends Validated<unknown>, U> = (sourceState: T['state']) => U;

type AdapterConstructorParams<
  T extends string,
  U extends Validated<unknown>,
  V,
> = {
  name: T;
  source: U;
  adaptFn: AdaptFn<U, V>;
};

export class Adapter<T extends string, U extends Validated<unknown>, V>
  implements IAdapter<T, V>
{
  public readonly name: T;
  private source: U;
  private adaptFn: AdaptFn<U, V>;
  private stateManager: StateManager<ValidatedState<V>>;

  public get state(): StateWithChanges<ValidatedState<V>> {
    return this.stateManager.state;
  }

  public constructor({
    name,
    source,
    adaptFn,
  }: AdapterConstructorParams<T, U, V>) {
    this.name = name;
    this.source = source;
    this.adaptFn = adaptFn;

    this.stateManager = new StateManager<ValidatedState<V>>({
      value: this.adaptFn(this.source.state),
      validity: this.source.state.validity,
    });

    this.subscribeToSource();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<ValidatedState<V>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private subscribeToSource(): void {
    this.source.subscribeToState(state => {
      this.stateManager.updateProperties({
        value: this.adaptFn(state),
        validity: state.validity,
      });
    });
  }
}
