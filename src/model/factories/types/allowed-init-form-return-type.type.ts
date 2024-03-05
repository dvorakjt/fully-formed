import type { AbstractAdapter } from '../../adapters';
import type { AbstractDerivedValue } from '../../derived-values';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FormElement, AutoTrim } from '../../form-elements';
import type {
  UniquelyNamed,
  DisjointlyNamed,
  PossiblyTransient,
} from '../../shared';
import type { InitFormReturnType } from './init-form-return-type.type';

type FormElementNamesAreUnique<FormElements extends readonly FormElement[]> = {
  formElements: UniquelyNamed<FormElements>;
};

type GroupNamesAreUnique<
  Groups extends ReadonlyArray<AbstractGroup<string, GroupMembers>>,
> = {
  groups: UniquelyNamed<Groups>;
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

type DerivedValueNamesAreUnique<
  DerivedValues extends ReadonlyArray<AbstractDerivedValue<string, unknown>>,
> = {
  derivedValues: UniquelyNamed<DerivedValues>;
};

export type AllowedInitFormReturnType<T extends InitFormReturnType> =
  FormElementNamesAreUnique<T['formElements']> &
    (T['groups'] extends ReadonlyArray<AbstractGroup<string, GroupMembers>> ?
      GroupNamesAreUnique<T['groups']>
    : object) &
    (T['adapters'] extends (
      ReadonlyArray<
        AbstractAdapter<
          string,
          FormElement | AbstractGroup<string, GroupMembers>,
          unknown
        >
      >
    ) ?
      AdapterNamesAreUnique<T['adapters']> &
        AdapterNamesAreNotNonTransientFormElementNames<
          T['adapters'],
          T['formElements']
        >
    : object) &
    (T['derivedValues'] extends (
      ReadonlyArray<AbstractDerivedValue<string, unknown>>
    ) ?
      DerivedValueNamesAreUnique<T['derivedValues']>
    : object) & {
      autoTrim?: AutoTrim<T['formElements']>;
    };
