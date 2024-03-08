import type { AbstractAdapter } from "../../adapters";
import type { FormElement } from "../../form-elements";
import type { AbstractGroup, GroupMembers } from "../../groups";
import type { PossiblyTransient } from "../../shared";

export type UserDefinedOrDefaultAdapter<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> = AbstractAdapter<
  Extract<FormElements[number], PossiblyTransient<false>>['name'] &
    Adapters[number]['name'],
  FormElement | AbstractGroup<string, GroupMembers>,
  unknown
>;