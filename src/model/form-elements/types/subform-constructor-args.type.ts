import type { FormConstructorArgs } from './form-constructor-args.type';
import type { FormConstituents } from './form-constituents.type';

export type SubFormConstructorArgs<
  Name extends string,
  Constituents extends FormConstituents,
  Transient extends boolean,
> = FormConstructorArgs<Name, Constituents> & {
  transient?: Transient;
};
