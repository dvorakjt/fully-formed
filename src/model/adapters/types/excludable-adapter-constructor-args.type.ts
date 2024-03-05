import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableAdaptFn } from './excludable-adapt-fn.type';

export type ExcludableAdapterConstructorArgs<
  Name extends string,
  Source extends FormElement | AbstractGroup<string, GroupMembers>,
  Value,
> = {
  name: Name;
  source: Source;
  adaptFn: ExcludableAdaptFn<Source, Value>;
};
