import type { ValidityReducerMemberState } from './validity-reducer-member-state.type';
import type { Nameable } from '../../shared';

export type ValidityReducerMember = Nameable<string> & {
  state: ValidityReducerMemberState;
};
