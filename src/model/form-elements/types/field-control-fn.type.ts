import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { StatefulArrayStates } from '../../reducers';
import type { ControlledFieldState } from './controlled-field-state.type';
import type { FieldState } from './field-state.type';
import type { FormElement } from './form-element.type';

export type FieldControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
  >,
  Value,
  Excludable extends boolean,
> = (
  controllerStates: StatefulArrayStates<Controllers>,
  ownState: FieldState<Value, Excludable>,
) => ControlledFieldState<Value, Excludable> | undefined;
