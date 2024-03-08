import type { GroupMembers } from '../../groups';

export type GroupReducerConstructorArgs<Members extends GroupMembers> = {
  members: Members;
};
