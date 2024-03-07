import type { ValidityReducerMemberState } from './validity-reducer-member-state.type';
import type { Nameable, Stateful } from '../../shared';

export type ValidityReducerMember = Nameable<string> &
  Stateful<ValidityReducerMemberState>;
