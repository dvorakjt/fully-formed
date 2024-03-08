import type { AbstractAdapter } from '../../adapters';
import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { PossiblyTransient } from '../../shared';

type DefaultAdapters<FormElements extends readonly FormElement[]> = {
  [K in keyof FormElements as FormElements[K] extends PossiblyTransient<false> ?
    K
  : never]: AbstractAdapter<
    FormElements[K]['name'],
    FormElements[K],
    FormElements[K]['state']['value']
  >;
};

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
