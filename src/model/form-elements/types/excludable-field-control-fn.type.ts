import type { ExcludableFieldState } from './excludable-field-state.type';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { StatefulArrayStates } from '../../reducers';
import type { ControlledExcludableFieldState } from './controlled-excludable-field-state.type';
import type { FormElement } from './form-element.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableField } from '../classes';

/**
 * Processes an array of form element and/or group states and returns an object
 * which can be used to control the state of an {@link ExcludableField}, or
 * `undefined` if no change in state is desired.
 * 
 * @typeParam Controllers - A readonly array of form elements and/or groups
 * whose states will be processed by the function.
 * 
 * @typeParam Value - The type of value contained by an {@link ExcludableField} 
 * controlled by a function of this type.
 * 
 * @param controllerStates - An array of form element and/or group states to 
 * process.
 * 
 * @param ownState - The current state of the {@link ExcludableField} controlled
 * by a function of this type.
 * 
 * @returns A {@link ControlledExcludableFieldState} object to be applied to the 
 * state of the controlled field, or `undefined` if no state change is desired.
 */
export type ExcludableFieldControlFn<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
  Value,
> = (
  controllerStates: StatefulArrayStates<Controllers>,
  ownState: ExcludableFieldState<Value>,
) => ControlledExcludableFieldState<Value> | undefined;
