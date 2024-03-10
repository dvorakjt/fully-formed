import type { AbstractAdapter } from '../../adapters';
import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { DefaultAdapters } from './default-adapters.type';

export type UserDefinedAndDefaultAdapters<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> = ReadonlyArray<
  | DefaultAdapters<FormElements>[keyof DefaultAdapters<FormElements>]
  | Adapters[number]
>;
