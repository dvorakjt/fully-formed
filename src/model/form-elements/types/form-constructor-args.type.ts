import type { AutoTrim } from './auto-trim.type';
import type { FormConstituents } from './form-constituents.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Form } from '../classes';

/**
 * An object passed as an argument to the constructor of a {@link Form}.
 *
 * @typeParam Name - A string literal representing the name of the form.
 *
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 */
export type FormConstructorArgs<
  Name extends string,
  Constituents extends FormConstituents,
> = {
  name: Name;
  formElements: Constituents['formElements'];
  groups: Constituents['groups'];
  adapters: Constituents['adapters'];
  derivedValues: Constituents['derivedValues'];
  autoTrim?: AutoTrim;
  id?: string;
  invalidMessage?: string;
  pendingMessage?: string;
  validMessage?: string;
};
