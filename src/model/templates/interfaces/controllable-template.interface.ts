import type {
  FormElement,
  ExcludableSubFormControlTemplate,
} from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormTemplate } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormFactory } from '../../factories';

/**
 * An interface that may be implemented by a class extending
 * {@link FormTemplate} in order to define a controller and controlFn for
 * a class created with the `createExcludableSubForm()` method of the
 * {@link FormFactory} class.
 */
export interface ControllableTemplate<
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> {
  controlledBy: ExcludableSubFormControlTemplate<Controller>;
}
