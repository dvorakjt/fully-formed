import type { FormElement } from './form-element.type';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableFieldControlFn } from './excludable-field-control-fn.type';

export type ExcludableFieldControlTemplate<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
  Value,
> = {
  controllers: Controllers;
  controlFn: ExcludableFieldControlFn<Controllers, Value>;
};
