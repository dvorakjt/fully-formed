import type { Excludable } from '../../shared';
import type { GroupMembers } from './group-members.type';

type NonExcludableMemberValues<Members extends GroupMembers> = {
  [M in Members[number] as M extends Excludable ? never
  : M['name']]: M['state']['value'];
};

type ExcludableMemberValues<Members extends GroupMembers> = {
  [M in Members[number] as M extends Excludable ? M['name']
  : never]+?: M['state']['value'];
};

export type GroupValue<Members extends GroupMembers> =
  NonExcludableMemberValues<Members> & ExcludableMemberValues<Members>;
