import type { Nameable } from '../../shared';
import type { ValueReducerMemberState } from './value-reducer-member-state.type';

export type ValueReducerMember = Nameable<string> & {
  state: ValueReducerMemberState;
};
