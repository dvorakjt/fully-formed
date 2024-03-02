import type { Excludable } from '../../shared';
import type { FieldGroupMembers } from './field-group-members.type';

type NonExcludableMemberValues<Members extends FieldGroupMembers> = {
  [M in Members[number] as M extends Excludable ? never
  : M['name']]: M['state']['value'];
};

type ExcludableMemberValues<Members extends FieldGroupMembers> = {
  [M in Members[number] as M extends Excludable ? M['name']
  : never]+?: M['state']['value'];
};

export type FieldGroupValue<Members extends FieldGroupMembers> =
  NonExcludableMemberValues<Members> & ExcludableMemberValues<Members>;
