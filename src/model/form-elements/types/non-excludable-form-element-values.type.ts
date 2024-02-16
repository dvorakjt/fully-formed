import type { FormElement } from './form-element.type';

export type NonExcludableFormElementValues<T extends readonly FormElement[]> = {
  [F in T[number] as F['transient'] extends false ?
    F['excludable'] extends false ?
      F['name']
    : never
  : never]: F['state']['value'];
};
