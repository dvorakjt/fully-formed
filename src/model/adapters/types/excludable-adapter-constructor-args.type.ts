import type { FormElement } from '../../form-elements';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { ExcludableAdaptFn } from './excludable-adapt-fn.type';

export type ExcludableAdapterConstructorArgs<
  Name extends string,
  Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
  Value,
> = {
  name: Name;
  source: Source;
  adaptFn: ExcludableAdaptFn<Source, Value>;
};
