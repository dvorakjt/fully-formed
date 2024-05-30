import type { Nameable, Stateful } from '../../shared';
import type { GroupState } from '../types';
import type { GroupMember } from './group-member.interface';

export interface IGroup<
  T extends string = string,
  U extends readonly GroupMember[] = readonly GroupMember[],
> extends Nameable<T>,
    Stateful<GroupState<U>> {}
