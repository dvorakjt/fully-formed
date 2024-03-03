import type { FieldGroupMembers } from '../../field-groups';

export type FieldGroupReducerConstructorArgs<
  Members extends FieldGroupMembers,
> = {
  members: Members;
};
