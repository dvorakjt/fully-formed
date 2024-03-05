import type { StatefulArrayStates } from '../../reducers';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { FormElement } from './form-element.type';

export type ExcludableSubFormControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
> = (controllerStates: StatefulArrayStates<Controllers>) => boolean;
