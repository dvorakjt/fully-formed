import type { FormElement } from './form-element.type';

export type ExcludableFormElementValues<T extends readonly FormElement[]> = {
  [F in T[number] as F['transient'] extends false ?
    F['excludable'] extends true ?
      F['name']
    : never
  : never]+?: F['state']['value'];
};
