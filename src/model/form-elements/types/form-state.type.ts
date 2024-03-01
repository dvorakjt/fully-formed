import type { AbstractAdapter } from '../../adapters';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { StateWithMessages } from '../../state';
import type { FirstNonValidField } from './first-non-valid-field.type';
import type { FirstNonValidFormElement } from './first-non-valid-form-element.type';
import type { FormElement } from './form-element.type';
import type { FormValue } from './form-value.type';

export type FormState<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown
    >
  >,
> = StateWithMessages<FormValue<FormElements, Adapters>> & {
  firstNonValidFormElement: FirstNonValidFormElement<FormElements> | null;
  firstNonValidField: FirstNonValidField<FormElements> | null;
};
