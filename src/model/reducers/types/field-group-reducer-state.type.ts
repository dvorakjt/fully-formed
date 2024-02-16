import type { FieldGroupMembers, FieldGroupValue } from '../../field-groups';
import type { State } from '../../state';

export type FieldGroupReducerState<Members extends FieldGroupMembers> = State<
  FieldGroupValue<Members>
> & {
  includedMemberNames: Array<Members[number]['name']>;
};
