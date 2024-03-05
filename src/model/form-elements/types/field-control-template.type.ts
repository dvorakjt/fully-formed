import type { FormElement } from './form-element.type';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FieldControlFn } from './field-control-fn.type';

export type FieldControlTemplate<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
  Value,
> = {
  controllers: Controllers;
  controlFn: FieldControlFn<Controllers, Value>;
};
