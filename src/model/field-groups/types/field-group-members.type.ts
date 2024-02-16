import type { AbstractField } from '../../form-elements';
import type { AbstractFieldGroup } from '../classes';

export type FieldGroupMember =
  | AbstractField<string, unknown, boolean, boolean>
  | AbstractFieldGroup<string, FieldGroupMembers>;
export type FieldGroupMembers = readonly FieldGroupMember[];
