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

export type FormElementNamesAreUnique<FormElements extends readonly FormElement[]> = {
  formElements: UniquelyNamed<FormElements>;
};

export type AdapterNamesAreUnique<
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

export type GroupNamesAreUnique<
  Groups extends ReadonlyArray<AbstractGroup<string, GroupMembers>>,
> = {
  groups: UniquelyNamed<Groups>;
};

export type DerivedValueNamesAreUnique<
  DerivedValues extends ReadonlyArray<AbstractDerivedValue<string, unknown>>,
> = {
  derivedValues: UniquelyNamed<DerivedValues>;
};

/**
 * Defines a set of rules that must be met by an object extending
 * {@link FormConstituents}.
 * 
 * @typeParam T - An object extending {@link FormConstituents}.
 * 
 * @remarks
 * Validates `T` against the following rules:
 * - Form element names must be unique
 * - Adapter names must be unique
 * - Adapters must not share their names with non-transient form elements
 * - Group names must be unique
 * - Derived value names must be unique
 */
export type AllowedConstituents<T extends FormConstituents> =
  FormElementNamesAreUnique<T['formElements']> &
    AdapterNamesAreUnique<T['adapters']> &
    AdapterNamesAreNotNonTransientFormElementNames<
      T['adapters'],
      T['formElements']
    > &
    GroupNamesAreUnique<T['groups']> &
    DerivedValueNamesAreUnique<T['derivedValues']>;
