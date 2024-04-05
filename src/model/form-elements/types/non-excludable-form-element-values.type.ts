import type { Excludable } from '../../shared';
import type { FormElement } from './form-element.type';

/**
 * Filters out transient and excludable form elements and returns an object
 * whose keys are the names of the remaining fields and whose values are the
 * types of values that each of those fields holds.
 */
export type NonExcludableFormElementValues<T extends readonly FormElement[]> = {
  [F in T[number] as F['transient'] extends false ?
    F extends Excludable ?
      never
    : F['name']
  : never]: F['state']['value'];
};
