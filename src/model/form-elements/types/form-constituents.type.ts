import type { AbstractAdapter } from '../../adapters';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { FormElement } from './form-element.type';
import type { AbstractDerivedValue } from '../../derived-values';

export type FormConstituents = {
  formElements: readonly FormElement[];
  fieldGroups: ReadonlyArray<AbstractFieldGroup<string, FieldGroupMembers>>;
  adapters: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown,
      boolean
    >
  >;
  derivedValues: ReadonlyArray<AbstractDerivedValue<string, unknown>>;
};
