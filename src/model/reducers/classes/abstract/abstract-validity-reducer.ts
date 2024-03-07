import type { Validity } from '../../../state';
import type { ValidityReducerMemberState } from '../../types';

export abstract class AbstractValidityReducer {
  public abstract validity: Validity;
  public abstract processMemberStateUpdate(
    memberName: string,
    state: ValidityReducerMemberState,
  ): void;
}
