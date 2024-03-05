import { AbstractGroupReducer } from '../abstract';
import { ValidityReducer } from './validity-reducer';
import {
  StateManager,
  type AbstractStateManager,
  type State,
} from '../../../state';
import type { Subscription } from 'rxjs';
import type { GroupMembers, GroupValue } from '../../../groups';
import type { GroupReducerConstructorArgs } from '../../types';

export class GroupReducer<
  const Members extends GroupMembers,
> extends AbstractGroupReducer<Members> {
  public readonly members: Members;
  private stateManager: AbstractStateManager<State<GroupValue<Members>>>;
  private validityReducer = new ValidityReducer();

  public get state(): State<GroupValue<Members>> {
    return this.stateManager.state;
  }

  private set state(state: State<GroupValue<Members>>) {
    this.stateManager.state = state;
  }

  public constructor({ members }: GroupReducerConstructorArgs<Members>) {
    super();
    this.members = members;
    this.initializeValidityReducer();
    this.stateManager = new StateManager<State<GroupValue<Members>>>(
      this.getInitialState(),
    );
    this.subscribeToMembers();
  }

  public subscribeToState(
    cb: (state: State<GroupValue<Members>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private initializeValidityReducer(): void {
    for (const member of this.members) {
      this.validityReducer.processMemberState(member.name, member.state);
    }
  }

  private getInitialState(): State<GroupValue<Members>> {
    return {
      value: this.getInitialValue(),
      validity: this.validityReducer.validity,
    };
  }

  private getInitialValue(): GroupValue<Members> {
    const value: Record<string, unknown> = {};
    for (const member of this.members) {
      if (this.isIncludedMember(member.state)) {
        value[member.name] = member.state.value;
      }
    }
    return value as GroupValue<Members>;
  }

  private subscribeToMembers(): void {
    for (const member of this.members) {
      member.subscribeToState(state => {
        this.validityReducer.processMemberState(member.name, state);
        this.state = {
          value: this.getUpdatedValue(member.name, state),
          validity: this.validityReducer.validity,
        };
      });
    }
  }

  private getUpdatedValue(
    memberName: Members[number]['name'],
    memberState: Members[number]['state'],
  ): GroupValue<Members> {
    const updatedValue = this.state.value as Record<string, unknown>;
    if (this.isIncludedMember(memberState)) {
      updatedValue[memberName] = memberState.value;
    } else {
      delete updatedValue[memberName];
    }
    return updatedValue as GroupValue<Members>;
  }

  private isIncludedMember(memberState: Members[number]['state']): boolean {
    return !('exclude' in memberState) || !memberState.exclude;
  }
}
