import type { AutoTrim } from './auto-trim.type';
import type { FormConstituents } from './form-constituents.type';

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
