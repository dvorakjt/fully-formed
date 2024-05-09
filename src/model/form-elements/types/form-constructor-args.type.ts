import type { AutoTrim } from './auto-trim.type';
import type { FormConstituents } from './form-constituents.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Form } from '../classes';

/**
 * An object passed as an argument to the constructor of a {@link Form}.
 *
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 */
export type FormConstructorArgs<Constituents extends FormConstituents> = {
  formElements: Constituents['formElements'];
  groups: Constituents['groups'];
  adapters: Constituents['adapters'];
  derivedValues: Constituents['derivedValues'];
  autoTrim?: AutoTrim;
};
