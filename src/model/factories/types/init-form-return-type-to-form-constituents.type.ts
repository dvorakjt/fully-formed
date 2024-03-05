import type { AbstractAdapter } from '../../adapters';
import type { AbstractDerivedValue } from '../../derived-values';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FormElement } from '../../form-elements';
import type { AllowedInitFormReturnType } from './allowed-init-form-return-type.type';
import type { InitFormReturnType } from './init-form-return-type.type';

export type InitFormReturnTypeToFormConstituents<
  T extends InitFormReturnType & AllowedInitFormReturnType<T>,
> = {
  formElements: T['formElements'];
  groups: T['groups'] extends (
    ReadonlyArray<AbstractGroup<string, GroupMembers>>
  ) ?
    T['groups']
  : [];
  adapters: T['adapters'] extends (
    ReadonlyArray<
      AbstractAdapter<
        string,
        FormElement | AbstractGroup<string, GroupMembers>,
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
