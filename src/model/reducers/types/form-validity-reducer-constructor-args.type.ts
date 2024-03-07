import type { AbstractAdapter } from '../../adapters';
import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';

export type FormValidityReducerConstructorArgs = {
  adapters: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >;
  transientFormElements: readonly FormElement[];
  groups: ReadonlyArray<AbstractGroup<string, GroupMembers>>;
};
