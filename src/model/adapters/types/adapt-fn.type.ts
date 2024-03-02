import type { FormElement } from '../../form-elements';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';

export type AdaptFn<
  Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
  Value,
> = (sourceState: Source['state']) => Value;
