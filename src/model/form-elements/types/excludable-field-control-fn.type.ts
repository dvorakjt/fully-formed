import type { ExcludableFieldState } from './excludable-field-state.type';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';
import type { StatefulArrayStates } from '../../reducers';
import type { ControlledExcludableFieldState } from './controlled-excludable-field-state.type';
import type { FormElement } from './form-element.type';

export type ExcludableFieldControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
  >,
  Value,
> = (
  controllerStates: StatefulArrayStates<Controllers>,
  ownState: ExcludableFieldState<Value>,
) => ControlledExcludableFieldState<Value> | undefined;
