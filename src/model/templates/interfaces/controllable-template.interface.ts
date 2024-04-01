import type {
  FormElement,
  ExcludableSubFormControlTemplate,
} from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';

export interface ControllableTemplate<
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> {
  controlledBy: ExcludableSubFormControlTemplate<Controller>;
}
