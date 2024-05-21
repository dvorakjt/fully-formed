import { ValidityReducer } from '../../reducers';
import {
  StateManager,
  type Validated,
  type ArrayOfStates,
  type ValidatedState,
  type Nameable,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { IAdapter } from '../interfaces';

type MultiAdapterSource = Nameable & Validated;

type MultiAdaptFn<T extends readonly MultiAdapterSource[], V> = (
  states: ArrayOfStates<T>,
) => V;

type MultiAdapterConstructorParams<
  T extends string,
  U extends readonly MultiAdapterSource[],
  V,
> = {
  name: T;
  sources: U;
  adaptFn: MultiAdaptFn<U, V>;
};

export class MultiAdapter<
  T extends string,
  U extends readonly MultiAdapterSource[],
  V,
> implements IAdapter<T, V>
{
  public readonly name: T;
  private sources: U;
  private sourceStates: ValidatedState[];
  private adaptFn: MultiAdaptFn<U, V>;
  private stateManager: StateManager<ValidatedState<V>>;
  private validityReducer: ValidityReducer;

  public get state(): ValidatedState<V> {
    return this.stateManager.state;
  }

  private set state(state: ValidatedState<V>) {
    this.stateManager.state = state;
  }

  public constructor({
    name,
    sources,
    adaptFn,
  }: MultiAdapterConstructorParams<T, U, V>) {
    this.name = name;
    this.sources = sources;
    this.adaptFn = adaptFn;
    this.validityReducer = new ValidityReducer({ members: this.sources });

    this.sourceStates = this.reduceSourceStates();
    const initialState = this.getState();
    this.stateManager = new StateManager<ValidatedState<V>>(initialState);

    this.subscribeToSources();
  }

  public subscribeToState(
    cb: (state: ValidatedState<V>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private reduceSourceStates(): ValidatedState[] {
    return this.sources.map(source => source.state);
  }

  private getState(): ValidatedState<V> {
    return {
      value: this.adaptFn(this.sourceStates as ArrayOfStates<U>),
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
