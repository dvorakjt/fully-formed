import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FormElement } from './form-element.type';

export type ExcludableSubFormControlFn<
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> = (controllerState: Controller['state']) => boolean;
