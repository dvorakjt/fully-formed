import type { AbstractAdapter } from '../../adapters';
import type { AbstractDerivedValue } from '../../derived-values';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { FormElement, AutoTrim } from '../../form-elements';

export type InitFormReturnType = {
  name: string;
  formElements: readonly FormElement[];
  fieldGroups?: ReadonlyArray<AbstractFieldGroup<string, FieldGroupMembers>>;
  adapters?: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown
    >
  >;
  derivedValues?: ReadonlyArray<AbstractDerivedValue<string, unknown>>;
  autoTrim?: AutoTrim<readonly FormElement[]>;
};
