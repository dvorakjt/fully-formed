import type { AbstractAdapter } from '../../adapters';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FormElement, FormValue } from '../../form-elements';
import type { State } from '../../state';

export type FormReducerState<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> = State<FormValue<FormElements, Adapters>>;
