import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableSubFormControlFn } from './excludable-subform-control-fn.type';
import type { FormElement } from './form-element.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableSubForm } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableSubFormConstructorArgs } from './excludable-subform-constructor-args.type';

/**
 * An object which can be provided to the constructor of an 
 * {@link ExcludableSubForm} as part of a 
 * {@link ExcludableSubFormConstructorArgs} object. This object specifies a
 * form element or group whose state will be provided to a function to determine
 * whether or not to exclude the value of the controlled form from that of its
 * parent form.
 * 
 * @typeParam Controller - A form element or group whose state will be 
 * processed by the `controlFn`.
 */
export type ExcludableSubFormControlTemplate<
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> = {
  controller: Controller;
  controlFn: ExcludableSubFormControlFn<Controller>;
};
