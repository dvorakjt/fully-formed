import type { FormConstructorArgs } from './form-constructor-args.type';
import type { FormConstituents } from './form-constituents.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SubForm } from '../classes';

/**
 * An object passed as an argument to the constructor of a {@link SubForm}.
 *
 * @typeParam Name - A string literal representing the name of the form.
 * 
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 * 
 * @typeParam Transient - Represents whether or not the value of the sub-form
 * will be included in the value of its parent form.
 */
export type SubFormConstructorArgs<
  Name extends string,
  Constituents extends FormConstituents,
  Transient extends boolean,
> = FormConstructorArgs<Name, Constituents> & {
  transient?: Transient;
};
