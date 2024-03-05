import type { Validity } from '../../../state';
import type { ValidityReducerMemberState } from '../../types';

export abstract class AbstractValidityReducer {
  public abstract validity: Validity;
  public abstract processMemberState(
    memberName: string,
    state: ValidityReducerMemberState,
  ): void;
}
