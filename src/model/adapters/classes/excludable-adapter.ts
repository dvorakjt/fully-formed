import {
  StateManager,
  type StateWithChanges,
  type Excludable,
  type Validated,
  type ValidatedState,
  type ExcludableState,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { IAdapter } from '../interfaces';

type AdaptFnReturnType<T> = {
  value: T;
  exclude: boolean;
};

type ExcludableAdaptFn<T extends Validated<unknown>, U> = (
  sourceState: T['state'],
) => AdaptFnReturnType<U>;

type ExcludableAdapterConstructorParams<
  T extends string,
  U extends Validated<unknown>,
  V,
> = {
  name: T;
  source: U;
  adaptFn: ExcludableAdaptFn<U, V>;
};

export class ExcludableAdapter<
    T extends string,
    U extends Validated<unknown>,
    V,
  >
  implements IAdapter<T, V>, Excludable
{
  public readonly name: T;
  private source: U;
  private adaptFn: ExcludableAdaptFn<U, V>;
  private stateManager: StateManager<ValidatedState<V> & ExcludableState>;

  public get state(): StateWithChanges<ValidatedState<V> & ExcludableState> {
    return this.stateManager.state;
  }

  public constructor({
    name,
    source,
    adaptFn,
  }: ExcludableAdapterConstructorParams<T, U, V>) {
    this.name = name;
    this.source = source;
    this.adaptFn = adaptFn;

    this.stateManager = new StateManager<ValidatedState<V> & ExcludableState>({
      ...this.adaptFn(this.source.state),
      validity: this.source.state.validity,
    });

    this.subscribeToSource();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<ValidatedState<V> & ExcludableState>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private subscribeToSource(): void {
    this.source.subscribeToState(state => {
      this.stateManager.updateProperties({
        ...this.adaptFn(state),
        validity: state.validity,
      });
    });
  }
}
