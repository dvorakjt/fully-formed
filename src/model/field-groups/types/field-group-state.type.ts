import type { StateWithMessages } from '../../state';
import type { FieldGroupValiditySource } from '../enums';
import type { FieldGroupMembers } from './field-group-members.type';
import type { FieldGroupValue } from './field-group-value.type';

export type FieldGroupState<Members extends FieldGroupMembers> =
  StateWithMessages<FieldGroupValue<Members>> & {
    includedMemberNames: Array<Members[number]['name']>;
    validitySource: FieldGroupValiditySource;
  };
