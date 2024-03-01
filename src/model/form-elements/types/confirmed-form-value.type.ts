import type { AbstractAdapter } from '../../adapters';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { Excludable } from '../../shared';
import type { ExcludableFormElementValues } from './excludable-form-element-values.type';
import type { FormElement } from './form-element.type';
import type { NonExcludableFormElementValues } from './non-excludable-form-element-values.type';

type ExcludableAdapterValues<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown
    >
  >,
> = {
  [A in Adapters[number] as A extends Excludable ? A['name']
  : never]+?: NonNullable<A['state']['value']>;
};

type NonExcludableAdapterValues<
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown
    >
  >,
> = {
  [A in Adapters[number] as A extends Excludable ? never
  : A['name']]: NonNullable<A['state']['value']>;
};

export type ConfirmedFormValue<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown
    >
  >,
> = ExcludableFormElementValues<FormElements> &
  NonExcludableFormElementValues<FormElements> &
  ExcludableAdapterValues<Adapters> &
  NonExcludableAdapterValues<Adapters>;
