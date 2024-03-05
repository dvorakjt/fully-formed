import type { StateWithMessages } from '../../state';
import type { GroupValiditySource } from '../enums';
import type { GroupMembers } from './group-members.type';
import type { GroupValue } from './group-value.type';

export type GroupState<Members extends GroupMembers> = StateWithMessages<
  GroupValue<Members>
> & {
  validitySource: GroupValiditySource;
};
