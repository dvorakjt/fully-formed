import type { AbstractGroup, GroupMembers } from '../../groups';
import type { StatefulArrayStates } from '../../reducers';
import type { ControlledFieldState } from './controlled-field-state.type';
import type { FieldState } from './field-state.type';
import type { FormElement } from './form-element.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Field } from '../classes';

/**
 * Processes an array of form element and/or group states and returns an object
 * which can be used to control the state of a {@link Field}, or `undefined` if 
 * no change in state is desired.
 * 
 * @typeParam Controllers - A readonly array of form elements and/or groups
 * whose states will be processed by the function.
 * 
 * @typeParam Value - The type of value contained by a {@link Field} controlled 
 * by a function of this type.
 * 
 * @param controllerStates - An array of form element and/or group states to 
 * process.
 * 
 * @param ownState - The current state of the {@link Field} controlled by a 
 * function of this type.
 * 
 * @returns A {@link ControlledFieldState} object to be applied to the 
 * state of the controlled field, or `undefined` if no state change is desired.
 */
export type FieldControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
  Value,
> = (
  controllerStates: StatefulArrayStates<Controllers>,
  ownState: FieldState<Value>,
) => ControlledFieldState<Value> | undefined;
