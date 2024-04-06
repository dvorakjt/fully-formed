import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FormElement } from './form-element.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableSubForm } from '../classes';

/**
 * Processes the state of a form element or group and returns a boolean value
 * indicating whether or not the {@link ExcludableSubForm} controlled by this
 * function should be excluded from the value of its parent form.
 *
 * @typeParam Controller - A form element or group whose state will be
 * processed by the function.
 *
 * @param controllerState - The state of a form element or group to be
 * processed.
 *
 * @returns `true` if the {@link ExcludableSubForm} should be excluded from the
 * value of its parent form, `false` if not.
 */
export type ExcludableSubFormControlFn<
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> = (controllerState: Controller['state']) => boolean;
