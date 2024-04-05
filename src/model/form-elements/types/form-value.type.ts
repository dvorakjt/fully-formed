import type { FormConstituents } from './form-constituents.type';
import type { AbstractAdapter } from '../../adapters';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { Excludable } from '../../shared';
import type { ExcludableFormElementValues } from './excludable-form-element-values.type';
import type { FormElement } from './form-element.type';
import type { NonExcludableFormElementValues } from './non-excludable-form-element-values.type';

/**
 * Filters out non-excludable adapters and returns an object whose keys consist
 * of the names of the remaining adapters, and whose values are the types of
 * values those adapters produce, or `undefined`.
 */
export type ExcludableAdapterValues<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> = {
  [A in Adapters[number] as A extends Excludable ? A['name']
  : never]+?: A['state']['value'];
};

/**
 * Filters out excludable adapters and returns an object whose keys consist
 * of the names of the remaining adapters, and whose values are the types of
 * values those adapters produce.
 */
export type NonExcludableAdapterValues<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> = {
  [A in Adapters[number] as A extends Excludable ? never
  : A['name']]: A['state']['value'];
};

/**
 * Produces an object whose keys consist of the names of all adapters and
 * non-transient form elements, and whose values are the types of values that 
 * those adapters/form elements produce/contain, or `undefined` for excludable
 * adapters/form elements.
 */
export type FormValue<Constituents extends FormConstituents> =
  ExcludableFormElementValues<Constituents['formElements']> &
    NonExcludableFormElementValues<Constituents['formElements']> &
    ExcludableAdapterValues<Constituents['adapters']> &
    NonExcludableAdapterValues<Constituents['adapters']>;
