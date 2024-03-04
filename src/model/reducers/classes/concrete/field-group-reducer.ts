import { AbstractFieldGroupReducer } from '../abstract';
import {
  StateManager,
  Validity,
  type AbstractStateManager,
  type State,
} from '../../../state';
import type { Subscription } from 'rxjs';
import type { FieldGroupMembers, FieldGroupValue } from '../../../field-groups';
import type { FieldGroupReducerConstructorArgs } from '../../types';

export class FieldGroupReducer<
  const Members extends FieldGroupMembers,
> extends AbstractFieldGroupReducer<Members> {
  public readonly members: Members;
  private stateManager: AbstractStateManager<State<FieldGroupValue<Members>>>;
  private pendingIncludedMemberNames: Set<Members[number]['name']>;
  private invalidIncludedMemberNames: Set<Members[number]['name']>;

  public get state(): State<FieldGroupValue<Members>> {
    return this.stateManager.state;
  }

  private set state(state: State<FieldGroupValue<Members>>) {
    this.stateManager.state = state;
  }

  public constructor({ members }: FieldGroupReducerConstructorArgs<Members>) {
    super();
    this.members = members;
    this.pendingIncludedMemberNames =
      this.initializePendingIncludedMemberNames();
    this.invalidIncludedMemberNames =
      this.initializeInvalidIncludedMemberNames();
    this.stateManager = new StateManager<State<FieldGroupValue<Members>>>(
      this.getInitialState(),
    );
    this.subscribeToMembers();
  }

  public subscribeToState(
    cb: (state: State<FieldGroupValue<Members>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private initializePendingIncludedMemberNames(): Set<Members[number]['name']> {
    const pendingIncludedMemberNames = new Set<Members[number]['name']>(
      this.members
        .filter(m => {
          return (
            this.isIncludedMember(m.state) &&
            m.state.validity === Validity.Pending
          );
        })
        .map(m => m.name),
    );
    return pendingIncludedMemberNames;
  }

  private initializeInvalidIncludedMemberNames(): Set<Members[number]['name']> {
    const invalidIncludedMemberNames = new Set<Members[number]['name']>(
      this.members
        .filter(m => {
          return (
            this.isIncludedMember(m.state) &&
            m.state.validity === Validity.Invalid
          );
        })
        .map(m => m.name),
    );
    return invalidIncludedMemberNames;
  }

  private getInitialState(): State<FieldGroupValue<Members>> {
    return {
      value: this.getInitialValue(),
      validity: this.determineValidity(),
    };
  }

  private getInitialValue(): FieldGroupValue<Members> {
    const value: Record<string, unknown> = {};
    for (const member of this.members) {
      if (this.isIncludedMember(member.state)) {
        value[member.name] = member.state.value;
      }
    }
    return value as FieldGroupValue<Members>;
  }

  private subscribeToMembers(): void {
    for (const member of this.members) {
      member.subscribeToState(state => {
        this.updateSets(member.name, state);
        this.state = {
          value: this.getUpdatedValue(member.name, state),
          validity: this.determineValidity(),
        };
      });
    }
  }

  private updateSets(
    memberName: Members[number]['name'],
    memberState: Members[number]['state'],
  ): void {
    if (this.isIncludedMember(memberState)) {
      this.updateSetsWithIncludedMemberName(memberName, memberState);
    } else {
      this.removeExcludedMemberNameFromSets(memberName);
    }
  }

  private updateSetsWithIncludedMemberName(
    memberName: Members[number]['name'],
    memberState: Members[number]['state'],
  ): void {
    if (memberState.validity === Validity.Invalid) {
      this.invalidIncludedMemberNames.add(memberName);
    } else {
      this.invalidIncludedMemberNames.delete(memberName);
    }
    if (memberState.validity === Validity.Pending) {
      this.pendingIncludedMemberNames.add(memberName);
    } else {
      this.pendingIncludedMemberNames.delete(memberName);
    }
  }

  private removeExcludedMemberNameFromSets(
    memberName: Members[number]['name'],
  ): void {
    this.pendingIncludedMemberNames.delete(memberName);
    this.invalidIncludedMemberNames.delete(memberName);
  }

  private getUpdatedValue(
    memberName: Members[number]['name'],
    memberState: Members[number]['state'],
  ): FieldGroupValue<Members> {
    const updatedValue = this.state.value as Record<string, unknown>;
    if (this.isIncludedMember(memberState)) {
      updatedValue[memberName] = memberState.value;
    } else {
      delete updatedValue[memberName];
    }
    return updatedValue as FieldGroupValue<Members>;
  }

  private determineValidity(): Validity {
    if (this.invalidIncludedMemberNames.size) return Validity.Invalid;
    if (this.pendingIncludedMemberNames.size) return Validity.Pending;
    return Validity.Valid;
  }

  private isIncludedMember(memberState: Members[number]['state']): boolean {
    return !('exclude' in memberState) || !memberState.exclude;
  }
}
