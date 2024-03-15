import type { SubFormConstructorArgs } from './subform-constructor-args.type';
import type { FormConstituents } from './form-constituents.type';

export type ExcludableSubFormConstructorArgs<
  Name extends string,
  Constituents extends FormConstituents,
  Transient extends boolean,
> = SubFormConstructorArgs<Name, Constituents, Transient> & {
  excludeByDefault?: boolean;
};
