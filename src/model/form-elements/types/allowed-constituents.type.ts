import type { FormElement } from './form-element.type';
import type { FormConstituents } from './form-constituents.type';
import type { AbstractAdapter } from '../../adapters';
import type { AbstractDerivedValue } from '../../derived-values';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type {
  UniquelyNamed,
  DisjointlyNamed,
  PossiblyTransient,
} from '../../shared';

type FormElementNamesAreUnique<FormElements extends readonly FormElement[]> = {
  formElements: UniquelyNamed<FormElements>;
};

type AdapterNamesAreUnique<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> = {
  adapters: UniquelyNamed<Adapters>;
};

export type AdapterNamesAreNotNonTransientFormElementNames<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
  FormElements extends readonly FormElement[],
> = {
  adapters: DisjointlyNamed<
    Adapters,
    ReadonlyArray<Extract<FormElements[number], PossiblyTransient<false>>>
  >;
};

type GroupNamesAreUnique<
  Groups extends ReadonlyArray<AbstractGroup<string, GroupMembers>>,
> = {
  groups: UniquelyNamed<Groups>;
};

type DerivedValueNamesAreUnique<
  DerivedValues extends ReadonlyArray<AbstractDerivedValue<string, unknown>>,
> = {
  derivedValues: UniquelyNamed<DerivedValues>;
};

export type AllowedConstituents<T extends FormConstituents> =
  FormElementNamesAreUnique<T['formElements']> &
    AdapterNamesAreUnique<T['adapters']> &
    AdapterNamesAreNotNonTransientFormElementNames<
      T['adapters'],
      T['formElements']
    > &
    GroupNamesAreUnique<T['groups']> &
    DerivedValueNamesAreUnique<T['derivedValues']>;
