import type { AbstractAdapter } from '../../adapters';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { ExcludableFormElementValues } from './excludable-form-element-values.type';
import type { FormElement } from './form-element.type';
import type { NonExcludableFormElementValues } from './non-excludable-form-element-values.type';

type ExcludableAdapterValues<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown,
      boolean
    >
  >,
> = {
  [A in Adapters[number] as A['excludable'] extends true ? A['name']
  : never]+?: A['state']['value'] | null;
};

type NonExcludableAdapterValues<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown,
      boolean
    >
  >,
> = {
  [A in Adapters[number] as A['excludable'] extends false ? A['name'] : never]:
    | A['state']['value']
    | null;
};

export type FormValue<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown,
      boolean
    >
  >,
> = ExcludableFormElementValues<FormElements> &
  NonExcludableFormElementValues<FormElements> &
  ExcludableAdapterValues<Adapters> &
  NonExcludableAdapterValues<Adapters>;
