import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableSubFormControlFn } from './excludable-subform-control-fn.type';
import type { FormElement } from './form-element.type';

export type ExcludableSubFormControlTemplate<
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> = {
  controller: Controller;
  controlFn: ExcludableSubFormControlFn<Controller>;
};
