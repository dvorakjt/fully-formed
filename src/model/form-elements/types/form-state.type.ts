import type { AbstractAdapter } from '../../adapters';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { StateWithMessages } from '../../state';
import type { FormElement } from './form-element.type';
import type { FormValue } from './form-value.type';

export type FormState<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> = StateWithMessages<FormValue<FormElements, Adapters>>;
