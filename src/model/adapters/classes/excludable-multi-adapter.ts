import { ValidityReducer } from '../../reducers';
import {
  StateManager,
  type Validated,
  type ArrayOfStates,
  type ValidatedState,
  type Nameable,
  type ExcludableState,
  type Excludable,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { IAdapter } from '../interfaces';
import type { ExcludableAdaptFnReturnType } from '../types';

type ExcludableMultiAdapterSource = Nameable & Validated;

type ExcludableMultiAdaptFn<
  T extends readonly ExcludableMultiAdapterSource[],
  V,
> = (states: ArrayOfStates<T>) => ExcludableAdaptFnReturnType<V>;

type ExcludableMultiAdapterConstructorParams<
  T extends string,
  U extends readonly ExcludableMultiAdapterSource[],
  V,
> = {
  name: T;
  sources: U;
  adaptFn: ExcludableMultiAdaptFn<U, V>;
};

type ExcludableMultiAdapterState<T> = ValidatedState<T> & ExcludableState;

export class ExcludableMultiAdapter<
    T extends string,
    U extends readonly ExcludableMultiAdapterSource[],
    V,
  >
  implements IAdapter<T, V>, Excludable
{
  public readonly name: T;
  private sources: U;
  private sourceStates: ValidatedState[];
  private adaptFn: ExcludableMultiAdaptFn<U, V>;
  private stateManager: StateManager<ExcludableMultiAdapterState<V>>;
  private validityReducer: ValidityReducer;

  public get state(): ExcludableMultiAdapterState<V> {
    return this.stateManager.state;
  }

  private set state(state: ExcludableMultiAdapterState<V>) {
    this.stateManager.state = state;
  }

  public constructor({
    name,
    sources,
    adaptFn,
  }: ExcludableMultiAdapterConstructorParams<T, U, V>) {
    this.name = name;
    this.sources = sources;
    this.adaptFn = adaptFn;
    this.validityReducer = new ValidityReducer({ members: this.sources });

    this.sourceStates = this.reduceSourceStates();
    const initialState = this.getState();
    this.stateManager = new StateManager<ExcludableMultiAdapterState<V>>(
      initialState,
    );

    this.subscribeToSources();
  }

  public subscribeToState(
    cb: (state: ExcludableMultiAdapterState<V>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private reduceSourceStates(): ValidatedState[] {
    return this.sources.map(source => source.state);
  }

  private getState(): ExcludableMultiAdapterState<V> {
    return {
      ...this.adaptFn(this.sourceStates as ArrayOfStates<U>),
      validity: this.validityReducer.validity,
    };
  }

  private subscribeToSources(): void {
    this.sources.forEach((source, index) => {
      source.subscribeToState(state => {
        this.updateSourceStates(state, index);
        this.validityReducer.processMemberStateUpdate(source.name, state);
        this.state = this.getState();
      });
    });
  }

  private updateSourceStates(state: ValidatedState, index: number): void {
    this.sourceStates[index] = state;
  }
}
