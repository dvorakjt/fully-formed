import type {
  FormElement,
  ExcludableSubFormControlTemplate,
} from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';

export interface ControllableTemplate<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
> {
  controlledBy: ExcludableSubFormControlTemplate<Controllers>;
}
