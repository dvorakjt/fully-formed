import type { AbstractAdapter } from '../../adapters';
import type { AbstractDerivedValue } from '../../derived-values';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { FormElement, NonTransientFormElement } from '../../form-elements';
import type { UniquelyNamed, DisjointlyNamed } from '../../shared';
import type { InitFormReturnType } from './init-form-return-type.type';

type FormElementNamesAreUnique<FormElements extends readonly FormElement[]> = {
  formElements: UniquelyNamed<FormElements>;
};

type FieldGroupNamesAreUnique<
  FieldGroups extends ReadonlyArray<
    AbstractFieldGroup<string, FieldGroupMembers>
  >,
> = {
  fieldGroups: UniquelyNamed<FieldGroups>;
};

type FieldGroupNamesAreNotFormElementNames<
  FieldGroups extends ReadonlyArray<
    AbstractFieldGroup<string, FieldGroupMembers>
  >,
  FormElements extends readonly FormElement[],
> = {
  fieldGroups: DisjointlyNamed<FieldGroups, FormElements>;
};

type FieldGroupMembersOccurInForm<
  FieldGroups extends ReadonlyArray<
    AbstractFieldGroup<string, FieldGroupMembers>
  >,
  FormElements extends readonly FormElement[],
> = {
  fieldGroups: ReadonlyArray<{
    members: ReadonlyArray<FieldGroups[number] | FormElements[number]>;
  }>;
};

type AdapterNamesAreUnique<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown,
      boolean
    >
  >,
> = {
  adapters: UniquelyNamed<Adapters>;
};

export type AdapterNamesAreNotNonTransientFormElementNames<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown,
      boolean
    >
  >,
  FormElements extends readonly FormElement[],
> = {
  adapters: DisjointlyNamed<
    Adapters,
    ReadonlyArray<Extract<FormElements[number], NonTransientFormElement>>
  >;
};

export type AdapterSourcesOccurInForm<
  FormElements extends readonly FormElement[],
  FieldGroups extends ReadonlyArray<
    AbstractFieldGroup<string, FieldGroupMembers>
  >,
> = {
  adapters: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElements[number] | FieldGroups[number],
      unknown,
      boolean
    >
  >;
};

type DerivedValueNamesAreUnique<
  DerivedValues extends ReadonlyArray<AbstractDerivedValue<string, unknown>>,
> = {
  derivedValues: UniquelyNamed<DerivedValues>;
};

export type AllowedInitFormReturnType<T extends InitFormReturnType> =
  FormElementNamesAreUnique<T['formElements']> &
    (T['fieldGroups'] extends (
      ReadonlyArray<AbstractFieldGroup<string, FieldGroupMembers>>
    ) ?
      FieldGroupNamesAreUnique<T['fieldGroups']> &
        FieldGroupNamesAreNotFormElementNames<
          T['fieldGroups'],
          T['formElements']
        > &
        FieldGroupMembersOccurInForm<T['fieldGroups'], T['formElements']>
    : object) &
    (T['adapters'] extends (
      ReadonlyArray<
        AbstractAdapter<
          string,
          FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
          unknown,
          boolean
        >
      >
    ) ?
      AdapterNamesAreUnique<T['adapters']> &
        AdapterNamesAreNotNonTransientFormElementNames<
          T['adapters'],
          T['formElements']
        > &
        AdapterSourcesOccurInForm<
          T['formElements'],
          T['fieldGroups'] extends (
            ReadonlyArray<AbstractFieldGroup<string, FieldGroupMembers>>
          ) ?
            T['fieldGroups']
          : []
        >
    : object) &
    (T['derivedValues'] extends (
      ReadonlyArray<AbstractDerivedValue<string, unknown>>
    ) ?
      DerivedValueNamesAreUnique<T['derivedValues']>
    : object);
