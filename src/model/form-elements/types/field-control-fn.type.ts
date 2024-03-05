import type { AbstractGroup, GroupMembers } from '../../groups';
import type { StatefulArrayStates } from '../../reducers';
import type { ControlledFieldState } from './controlled-field-state.type';
import type { FieldState } from './field-state.type';
import type { FormElement } from './form-element.type';

export type FieldControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
  Value,
> = (
  controllerStates: StatefulArrayStates<Controllers>,
  ownState: FieldState<Value>,
) => ControlledFieldState<Value> | undefined;
