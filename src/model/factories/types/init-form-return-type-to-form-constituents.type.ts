import type { AbstractAdapter } from '../../adapters';
import type { AbstractDerivedValue } from '../../derived-values';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { FormElement } from '../../form-elements';
import type { AllowedInitFormReturnType } from './allowed-init-form-return-type.type';
import type { InitFormReturnType } from './init-form-return-type.type';

export type InitFormReturnTypeToFormConstituents<
  T extends InitFormReturnType & AllowedInitFormReturnType<T>,
> = {
  formElements: T['formElements'];
  fieldGroups: T['fieldGroups'] extends (
    ReadonlyArray<AbstractFieldGroup<string, FieldGroupMembers>>
  ) ?
    T['fieldGroups']
  : [];
  adapters: T['adapters'] extends (
    ReadonlyArray<
      AbstractAdapter<
        string,
        FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
        unknown
      >
    >
  ) ?
    T['adapters']
  : [];
  derivedValues: T['derivedValues'] extends (
    ReadonlyArray<AbstractDerivedValue<string, unknown>>
  ) ?
    T['derivedValues']
  : [];
};
