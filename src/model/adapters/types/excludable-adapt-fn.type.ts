import type { FormElement } from '../../form-elements';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { ExcludableAdaptFnReturnType } from '.';

export type ExcludableAdaptFn<
  Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
  Value,
> = (sourceState: Source['state']) => ExcludableAdaptFnReturnType<Value>;
