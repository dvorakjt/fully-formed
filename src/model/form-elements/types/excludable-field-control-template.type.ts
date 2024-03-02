import type { FormElement } from './form-element.type';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { ExcludableFieldControlFn } from './excludable-field-control-fn.type';

export type ExcludableFieldControlTemplate<
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
  >,
  Value,
> = {
  controllers: Controllers;
  controlFn: ExcludableFieldControlFn<Controllers, Value>;
};
