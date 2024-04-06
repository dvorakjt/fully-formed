import type { SubFormConstructorArgs } from './subform-constructor-args.type';
import type { FormConstituents } from './form-constituents.type';
import type { ExcludableSubFormControlTemplate } from './excludable-subform-control-template.type';
import type { FormElement } from './form-element.type';
import type { AbstractGroup, GroupMembers } from '../../groups';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableSubForm } from '../classes';

/**
 * An object passed as an argument to the constructor of an
 * {@link ExcludableSubForm}.
 *
 * @typeParam Name - A string literal representing the name of the form.
 *
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 *
 * @typeParam Transient - Represents whether or not the value of the sub-form
 * will be included in the value of its parent form.
 *
 * @typeParam Controller - A form element or group whose state controls whether
 * or not the value of the form is included in its parent form's value.
 */
export type ExcludableSubFormConstructorArgs<
  Name extends string,
  Constituents extends FormConstituents,
  Transient extends boolean,
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> = SubFormConstructorArgs<Name, Constituents, Transient> & {
  excludeByDefault?: boolean;
  controlledBy?: ExcludableSubFormControlTemplate<Controller>;
};
