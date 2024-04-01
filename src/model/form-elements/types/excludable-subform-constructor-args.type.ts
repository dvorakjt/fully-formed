import type { SubFormConstructorArgs } from './subform-constructor-args.type';
import type { FormConstituents } from './form-constituents.type';
import type { ExcludableSubFormControlTemplate } from './excludable-subform-control-template.type';
import type { FormElement } from './form-element.type';
import type { AbstractGroup, GroupMembers } from '../../groups';

export type ExcludableSubFormConstructorArgs<
  Name extends string,
  Constituents extends FormConstituents,
  Transient extends boolean,
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> = SubFormConstructorArgs<Name, Constituents, Transient> & {
  excludeByDefault?: boolean;
  controlledBy?: ExcludableSubFormControlTemplate<Controller>;
};
