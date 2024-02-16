import type {
  AbstractFieldGroup,
  FieldGroupMembers,
} from '../../../field-groups';
import type {
  FirstNonValidFormElement,
  FirstNonValidField,
  FormElement,
} from '../../../form-elements';

export abstract class AbstractFormElementAndGroupHeap<
  FormElements extends readonly FormElement[],
  FieldGroups extends ReadonlyArray<
    AbstractFieldGroup<string, FieldGroupMembers>
  >,
> {
  public abstract firstNonValidFormElement: FirstNonValidFormElement<FormElements> | null;
  public abstract firstNonValidField: FirstNonValidField<FormElements> | null;
  public abstract processFormElementStateUpdate<F extends FormElements[number]>(
    name: F['name'],
    state: F['state'],
  ): void;
  public abstract processFieldGroupStateUpdate<G extends FieldGroups[number]>(
    name: G['name'],
    state: G['state'],
  ): void;
}
