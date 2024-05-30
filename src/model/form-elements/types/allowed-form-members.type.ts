import type { FormChild } from '../interfaces';
import type { FormMembers } from './form-members.type';
import type { IAdapter } from '../../adapters';
import type { IGroup } from '../../groups';
import type { PossiblyTransient } from '../interfaces';
import type { UniquelyNamed, DisjointlyNamed } from '../../shared';

export type FieldNamesAreUnique<Fields extends readonly FormChild[]> = {
  fields: UniquelyNamed<Fields>;
};

export type AdapterNamesAreUnique<Adapters extends readonly IAdapter[]> = {
  adapters: UniquelyNamed<Adapters>;
};

export type AdapterNamesAreNotNonTransientFieldNames<
  Adapters extends readonly IAdapter[],
  Fields extends readonly FormChild[],
> = {
  adapters: DisjointlyNamed<
    Adapters,
    ReadonlyArray<Exclude<Fields[number], PossiblyTransient<true>>>
  >;
};

export type GroupNamesAreUnique<Groups extends readonly IGroup[]> = {
  groups: UniquelyNamed<Groups>;
};

/**
 * Defines a set of rules that must be met by an object extending
 * {@link FormMembers}.
 *
 * @typeParam T - An object extending {@link FormMembers}.
 *
 * @remarks
 * Validates `T` against the following rules:
 * - Form element names must be unique
 * - Adapter names must be unique
 * - Adapters must not share their names with non-transient form elements
 * - Group names must be unique
 */
export type AllowedFormMembers<T extends FormMembers> = FieldNamesAreUnique<
  T['fields']
> &
  AdapterNamesAreUnique<T['adapters']> &
  AdapterNamesAreNotNonTransientFieldNames<T['adapters'], T['fields']> &
  GroupNamesAreUnique<T['groups']>;
