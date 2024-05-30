import { Validity } from '../../shared';
import type {
  ValidityReducerMember,
  ValidityReducerMemberState,
} from '../types';

type ValidityReducerConstructorParams = {
  members: readonly ValidityReducerMember[];
};

export class ValidityReducer {
  private invalidIncludedMemberNames: Set<string> = new Set<string>();
  private pendingIncludedMemberNames: Set<string> = new Set<string>();

  public get validity(): Validity {
    if (this.invalidIncludedMemberNames.size) return Validity.Invalid;
    if (this.pendingIncludedMemberNames.size) return Validity.Pending;
    return Validity.Valid;
  }

  public constructor({ members }: ValidityReducerConstructorParams) {
    members.forEach(m => this.processMemberStateUpdate(m.name, m.state));
  }

  public processMemberStateUpdate(
    memberName: string,
    state: ValidityReducerMemberState,
  ): void {
    if (state.validity === Validity.Invalid && !state.exclude) {
      this.invalidIncludedMemberNames.add(memberName);
    } else {
      this.invalidIncludedMemberNames.delete(memberName);
    }
    if (state.validity === Validity.Pending && !state.exclude) {
      this.pendingIncludedMemberNames.add(memberName);
    } else {
      this.pendingIncludedMemberNames.delete(memberName);
    }
  }
}
