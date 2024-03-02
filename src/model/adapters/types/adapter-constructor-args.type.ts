import type { FormElement } from '../../form-elements';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { AdaptFn } from './adapt-fn.type';

export type AdapterConstructorArgs<
  Name extends string,
  Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
  Value,
> = {
  name: Name;
  source: Source;
  adaptFn: AdaptFn<Source, Value>;
};
