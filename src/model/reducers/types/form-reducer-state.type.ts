import type { AbstractAdapter } from '../../adapters';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type {
  FirstNonValidFormElement,
  FormElement,
  FormValue,
} from '../../form-elements';
import type { FirstNonValidField } from '../../form-elements/types/first-non-valid-field.type';
import type { Validity } from '../../state';

export type FormReducerState<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
      unknown
    >
  >,
> = {
  value: FormValue<FormElements, Adapters>;
  validity: Validity;
  firstNonValidFormElement: FirstNonValidFormElement<FormElements>;
  firstNonValidField: FirstNonValidField<FormElements>;
};
