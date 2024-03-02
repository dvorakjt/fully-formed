import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { ExcludableSubFormControlFn } from './excludable-subform-control-fn.type';
import type { FormElement } from './form-element.type';

export type ExcludableSubFormControlTemplate<
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
  >,
> = {
  controllers: Controllers;
  controlFn: ExcludableSubFormControlFn<Controllers>;
};
