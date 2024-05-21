import type { GroupMember } from '../interfaces';
import type { Excludable, ValueOf } from '../../shared';

type NonExcludableMemberValues<T extends readonly GroupMember[]> = {
  [M in T[number] as M extends Excludable ? never : M['name']]: ValueOf<M>;
};

type ExcludableMemberValues<T extends readonly GroupMember[]> = {
  [M in T[number] as M extends Excludable ? M['name'] : never]+?: ValueOf<M>;
};

export type GroupValue<T extends readonly GroupMember[] = GroupMember[]> =
  NonExcludableMemberValues<T> & ExcludableMemberValues<T>;
