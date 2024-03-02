import type { AbstractField } from '../../form-elements';
import type { AbstractFieldGroup } from '../classes';

export type FieldGroupMember =
  | AbstractField<string, unknown, boolean>
  | AbstractFieldGroup<string, FieldGroupMembers>;
export type FieldGroupMembers = readonly FieldGroupMember[];
