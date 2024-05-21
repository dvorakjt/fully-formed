import {
  StateManager,
  type Excludable,
  type Validated,
  type ExcludableState,
  type ValidatedState,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { IAdapter } from '../interfaces';
import type { ExcludableAdaptFnReturnType } from '../types';

type ExcludableAdaptFn<T extends Validated<unknown>, U> = (
  sourceState: T['state'],
) => ExcludableAdaptFnReturnType<U>;

type ExcludableAdapterConstructorParams<
  T extends string,
  U extends Validated<unknown>,
  V,
> = {
  name: T;
  source: U;
  adaptFn: ExcludableAdaptFn<U, V>;
};

type ExcludableAdapterState<T> = ValidatedState<T> & ExcludableState;

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
  private stateManager: StateManager<ExcludableAdapterState<V>>;

  public get state(): ExcludableAdapterState<V> {
    return this.stateManager.state;
  }

  private set state(state: ExcludableAdapterState<V>) {
    this.stateManager.state = state;
  }

  public constructor({
    name,
    source,
    adaptFn,
  }: ExcludableAdapterConstructorParams<T, U, V>) {
    this.name = name;
    this.source = source;
    this.adaptFn = adaptFn;
    this.stateManager = new StateManager<ExcludableAdapterState<V>>(
      this.getInitialState(),
    );
    this.subscribeToSource();
  }

  public subscribeToState(
    cb: (state: ExcludableAdapterState<V>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private getInitialState(): ExcludableAdapterState<V> {
    return {
      ...this.adaptFn(this.source.state),
      validity: this.source.state.validity,
    };
  }

  private subscribeToSource(): void {
    this.source.subscribeToState(state => {
      this.state = {
        ...this.adaptFn(state),
        validity: state.validity,
      };
    });
  }
}
