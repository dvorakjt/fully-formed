import { ValidityReducer } from './validity-reducer';
import { ValueReducer } from './value-reducer';
import {
  StateManager,
  type Validated,
  type ValidatedState,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { GroupMember, GroupValue } from '../../groups';

type GroupReducerConstructorParams<T extends readonly GroupMember[]> = {
  members: T;
};

export class GroupReducer<const T extends readonly GroupMember[]>
  implements Validated<GroupValue<T>>
{
  private members: T;
  private valueReducer: ValueReducer<GroupValue<T>>;
  private validityReducer: ValidityReducer;
  private stateManager: StateManager<ValidatedState<GroupValue<T>>>;

  public get state(): ValidatedState<GroupValue<T>> {
    return this.stateManager.state;
  }

  private set state(state: ValidatedState<GroupValue<T>>) {
    this.stateManager.state = state;
  }

  public constructor({ members }: GroupReducerConstructorParams<T>) {
    this.members = members;
    this.valueReducer = new ValueReducer<GroupValue<T>>({ members });
    this.validityReducer = new ValidityReducer({ members });
    this.stateManager = new StateManager<ValidatedState<GroupValue<T>>>({
      value: this.valueReducer.value,
      validity: this.validityReducer.validity,
    });
    this.subscribeToMembers();
  }

  public subscribeToState(
    cb: (state: ValidatedState<GroupValue<T>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private subscribeToMembers(): void {
    this.members.forEach(member => {
      member.subscribeToState(state => {
        this.valueReducer.processMemberStateUpdate(member.name, state);
        this.validityReducer.processMemberStateUpdate(member.name, state);
        this.state = {
          value: this.valueReducer.value,
          validity: this.validityReducer.validity,
        };
      });
    });
  }
}
