import type { FormConstituents } from './form-constituents.type';
import type { AbstractAdapter } from '../../adapters';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { Excludable } from '../../shared';
import type { ExcludableFormElementValues } from './excludable-form-element-values.type';
import type { FormElement } from './form-element.type';
import type { NonExcludableFormElementValues } from './non-excludable-form-element-values.type';

type ExcludableAdapterValues<
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

type NonExcludableAdapterValues<
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

export type FormValue<Constituents extends FormConstituents> =
  ExcludableFormElementValues<Constituents['formElements']> &
    NonExcludableFormElementValues<Constituents['formElements']> &
    ExcludableAdapterValues<Constituents['adapters']> &
    NonExcludableAdapterValues<Constituents['adapters']>;
