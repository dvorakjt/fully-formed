import { AbstractValidityReducer } from '../abstract';
import { Validity } from '../../../state';
import type {
  ValidityReducerConstructorArgs,
  ValidityReducerMemberState,
} from '../../types';

/**
 * Processes the states of elements whose states contain a `validity` property,
 * and reduces the validities of each of those elements into a single value.
 */
export class ValidityReducer extends AbstractValidityReducer {
  private invalidIncludedMemberNames: Set<string> = new Set<string>();
  private pendingIncludedMemberNames: Set<string> = new Set<string>();

  public get validity(): Validity {
    if (this.invalidIncludedMemberNames.size) return Validity.Invalid;
    if (this.pendingIncludedMemberNames.size) return Validity.Pending;
    return Validity.Valid;
  }

  public constructor({ members }: ValidityReducerConstructorArgs) {
    super();
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
