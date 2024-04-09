import { AbstractStatefulArrayReducer } from '../abstract';
import { StateManager, type AbstractStateManager } from '../../../state';
import type { Subscription } from 'rxjs';
import type { Stateful } from '../../../shared';
import type {
  StatefulArrayStates,
  StatefulArrayConstructorArgs,
} from '../../types';

/**
 * Subscribes to an array of instances of classes implementing the 
 * {@link Stateful} interface and maintains an array of their states in its
 * `state` property. Emits updates to this array to subscribers.
 */
export class StatefulArrayReducer<
  const T extends ReadonlyArray<Stateful<unknown>>,
> extends AbstractStatefulArrayReducer<T> {
  private members: T;
  private stateManager: AbstractStateManager<StatefulArrayStates<T>>;

  public get state(): StatefulArrayStates<T> {
    return this.stateManager.state;
  }

  private set state(state: StatefulArrayStates<T>) {
    this.stateManager.state = state;
  }

  public constructor({ members }: StatefulArrayConstructorArgs<T>) {
    super();
    this.members = members;
    this.stateManager = new StateManager<StatefulArrayStates<T>>(
      this.getInitialState(),
    );
    this.subscribeToMembers();
  }

  /**
   * Executes a callback function whenever the state of the 
   * {@link StatefulArrayReducer} changes.
   *
   * @param cb - The callback function to be executed when the state of the 
   * {@link StatefulArrayReducer} changes.
   * 
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToState(
    cb: (state: StatefulArrayStates<T>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private getInitialState(): StatefulArrayStates<T> {
    return this.members.map(member => member.state) as StatefulArrayStates<T>;
  }

  private subscribeToMembers(): void {
    this.members.forEach((member, index) => {
      member.subscribeToState(memberState => {
        const updatedState = [
          ...this.state.slice(0, index),
          memberState,
          ...this.state.slice(index + 1),
        ];
        this.state = updatedState as StatefulArrayStates<T>;
      });
    });
  }
}
