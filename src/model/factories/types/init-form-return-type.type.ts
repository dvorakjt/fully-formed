import type { AbstractAdapter } from '../../adapters';
import type { AbstractDerivedValue } from '../../derived-values';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FormElement, AutoTrim } from '../../form-elements';

export type InitFormReturnType = {
  name: string;
  formElements: readonly FormElement[];
  groups?: ReadonlyArray<AbstractGroup<string, GroupMembers>>;
  adapters?: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >;
  derivedValues?: ReadonlyArray<AbstractDerivedValue<string, unknown>>;
  invalidMessage?: string;
  pendingMessage?: string;
  validMessage?: string;
  autoTrim?: AutoTrim<readonly FormElement[]>;
};
