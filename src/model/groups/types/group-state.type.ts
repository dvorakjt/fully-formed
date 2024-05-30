import type { ValidatedState, MessageBearerState } from '../../shared';
import type { GroupValue } from './group-value.type';
import type { GroupMember } from '../interfaces';
import type { GroupValiditySource } from '../enums';

export type GroupState<Members extends readonly GroupMember[] = GroupMember[]> =
  ValidatedState<GroupValue<Members>> &
    MessageBearerState & {
      validitySource: GroupValiditySource;
    };
