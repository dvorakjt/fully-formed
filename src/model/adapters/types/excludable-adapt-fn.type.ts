import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableAdaptFnReturnType } from '.';

export type ExcludableAdaptFn<
  Source extends FormElement | AbstractGroup<string, GroupMembers>,
  Value,
> = (sourceState: Source['state']) => ExcludableAdaptFnReturnType<Value>;
