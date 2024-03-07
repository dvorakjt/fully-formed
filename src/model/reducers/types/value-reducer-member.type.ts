import type { Nameable, Stateful } from '../../shared';
import type { ValueReducerMemberState } from './value-reducer-member-state.type';

export type ValueReducerMember = Nameable<string> &
  Stateful<ValueReducerMemberState>;
