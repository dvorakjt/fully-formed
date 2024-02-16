import type { PossiblyExcludable } from '../../shared';
import type { FieldGroupMembers } from './field-group-members.type';

type NonExcludableMemberValues<Members extends FieldGroupMembers> = {
  [M in Members[number] as M extends PossiblyExcludable<boolean> ?
    M['excludable'] extends true ?
      never
    : M['name']
  : M['name']]: M['state']['value'];
};

type ExcludableMemberValues<Members extends FieldGroupMembers> = {
  [M in Members[number] as M extends PossiblyExcludable<boolean> ?
    M['excludable'] extends true ?
      M['name']
    : never
  : never]+?: M['state']['value'];
};

export type FieldGroupValue<Members extends FieldGroupMembers> =
  NonExcludableMemberValues<Members> & ExcludableMemberValues<Members>;
