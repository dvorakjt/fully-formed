import { AbstractStatefulArrayReducer } from "../abstract";
import { StateManager, type AbstractStateManager } from "../../../state";
import type { Subscription } from "rxjs";
import type { Stateful } from "../../../shared";
import type { StatefulArrayStates, StatefulArrayConstructorArgs } from "../../types";

/**
 * Groups the state of a collection of {@link Stateful} items into an array and emits a new array when the state of any members changes.
 */
export class StatefulArrayReducer<T extends ReadonlyArray<Stateful<unknown>>> extends AbstractStatefulArrayReducer<T> {
  private members : T;
  private stateManager : AbstractStateManager<StatefulArrayStates<T>>;
  
  public get state(): StatefulArrayStates<T> {
    return this.stateManager.state;
  }

  private set state(state : StatefulArrayStates<T>) {
    this.stateManager.state = state;
  }

  /**
   * @param argsObject - An object containing the required property `members` which refers to an array of {@link Stateful} items to be reduced.
   */
  public constructor({
    members
  } : StatefulArrayConstructorArgs<T>) {
    super();
    this.members = members;
    this.stateManager = new StateManager<StatefulArrayStates<T>>(this.getInitialState());
    this.subscribeToMembers();
  }

  /**
   * Calls the provided callback function in response to any changes to `state`.
   * 
   * @param cb - The callback function to be called when `state` has changed.
   * @returns A {@link Subscription}.
   */
  public subscribeToState(cb: (state: StatefulArrayStates<T>) => void): Subscription {
    return this.stateManager.subscribeToState(cb);
  }
  
  private getInitialState() : StatefulArrayStates<T> {
    return this.members.map(member => member.state) as StatefulArrayStates<T>;
  }

  private subscribeToMembers() : void {
    this.members.forEach((member, index) => {
      member.subscribeToState(memberState => {
        const updatedState = [
          ...this.state.slice(0, index),
          memberState, 
          ...this.state.slice(index + 1)
        ];
        this.state = updatedState as StatefulArrayStates<T>;
      });
    });
  }
}