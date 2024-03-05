import type { ExcludableFieldState } from './excludable-field-state.type';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { StatefulArrayStates } from '../../reducers';
import type { ControlledExcludableFieldState } from './controlled-excludable-field-state.type';
import type { FormElement } from './form-element.type';

export type ExcludableFieldControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
  Value,
> = (
  controllerStates: StatefulArrayStates<Controllers>,
  ownState: ExcludableFieldState<Value>,
) => ControlledExcludableFieldState<Value> | undefined;
