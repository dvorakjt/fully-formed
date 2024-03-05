import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';

export type AdaptFn<
  Source extends FormElement | AbstractGroup<string, GroupMembers>,
  Value,
> = (sourceState: Source['state']) => Value;
