import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { AdaptFn } from './adapt-fn.type';

export type AdapterConstructorArgs<
  Name extends string,
  Source extends FormElement | AbstractGroup<string, GroupMembers>,
  Value,
> = {
  name: Name;
  source: Source;
  adaptFn: AdaptFn<Source, Value>;
};
