import type { AbstractAdapter } from '../../adapters';
import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';

export type FormReducerConstructorArgs = {
  adapters: Array<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >;
  transientFormElements: FormElement[];
  groups: ReadonlyArray<AbstractGroup<string, GroupMembers>>;
};
