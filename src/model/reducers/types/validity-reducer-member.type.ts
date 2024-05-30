import type { Nameable } from '../../shared';
import type { ValidityReducerMemberState } from './validity-reducer-member-state.type';

export type ValidityReducerMember = Nameable & {
  state: ValidityReducerMemberState;
};
