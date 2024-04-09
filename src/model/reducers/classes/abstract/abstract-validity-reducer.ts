import type { Validity } from '../../../state';
import type { ValidityReducerMemberState } from '../../types';

/**
 * Processes the states of elements whose states contain a `validity` property,
 * and reduces the validities of each of those elements into a single value.
 */
export abstract class AbstractValidityReducer {
  public abstract validity: Validity;
  public abstract processMemberStateUpdate(
    memberName: string,
    state: ValidityReducerMemberState,
  ): void;
}
