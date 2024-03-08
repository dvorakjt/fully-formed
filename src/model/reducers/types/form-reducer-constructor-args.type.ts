import type { PossiblyTransient } from '../../shared';
import type { AbstractAdapter } from '../../adapters';
import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { UserDefinedAndDefaultAdapters } from './user-defined-and-default-adapters.type';

export type FormReducerConstructorArgs<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> = {
  adapters: UserDefinedAndDefaultAdapters<FormElements, Adapters>;
  transientFormElements: ReadonlyArray<
    Extract<FormElements[number], PossiblyTransient<true>>
  >;
  groups: ReadonlyArray<AbstractGroup<string, GroupMembers>>;
};
