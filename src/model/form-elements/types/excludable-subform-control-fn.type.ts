import type { StatefulArrayStates } from '../../reducers';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { FormElement } from './form-element.type';

export type ExcludableSubFormControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
  >,
> = (controllerStates: StatefulArrayStates<Controllers>) => boolean;
