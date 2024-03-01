import type { Excludable } from '../../shared';
import type { FormElement } from './form-element.type';

export type NonExcludableFormElementValues<T extends readonly FormElement[]> = {
  [F in T[number] as F['transient'] extends false ?
    F extends Excludable ?
      never
    : F['name']
  : never]: F['state']['value'];
};
