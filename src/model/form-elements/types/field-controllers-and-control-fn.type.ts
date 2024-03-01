import type { FormElement } from './form-element.type';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { FieldControlFn } from './field-control-fn.type';

export type FieldControllersAndControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
  >,
  Value,
> = {
  controllers: Controllers;
  controlFn: FieldControlFn<Controllers, Value>;
};
