import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableSubFormControlFn } from './excludable-subform-control-fn.type';
import type { FormElement } from './form-element.type';

export type ExcludableSubFormControlTemplate<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
> = {
  controllers: Controllers;
  controlFn: ExcludableSubFormControlFn<Controllers>;
};
