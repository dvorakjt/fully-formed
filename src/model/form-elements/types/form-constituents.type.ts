import type { AbstractAdapter } from '../../adapters';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FormElement } from './form-element.type';
import type { AbstractDerivedValue } from '../../derived-values';

export type FormConstituents = {
  formElements: readonly FormElement[];
  groups: ReadonlyArray<AbstractGroup<string, GroupMembers>>;
  adapters: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >;
  derivedValues: ReadonlyArray<AbstractDerivedValue<string, unknown>>;
};
