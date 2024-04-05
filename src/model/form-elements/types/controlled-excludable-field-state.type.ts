import type { InteractableState, ExcludableState } from '../../shared';
import type { StateWithMessages } from '../../state';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableFieldControlFn } from './excludable-field-control-fn.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableField } from '../classes';

/**
 * An object that can be returned by an {@link ExcludableFieldControlFn}. The
 * object is then used to control the state of an {@link ExcludableField}.
 * 
 * @typeParam Value - The type of value that the controlled 
 * {@link ExcludableField} holds.
 * 
 * @remarks
 * If the object includes a `value`, `validity` or `messages` property, the 
 * other two properties are also required.
 * 
 * @example
 * ```
 * // not valid - `value` is included without `validity` and `messages`
 * const invalidState : ControlledExcludableFieldState<string> = {
 *   value : 'hello'
 * }
 * 
 * // valid - `value`, `validity`, and `messages` are all present
 * const validState : ControlledExcludableFieldState<string> = {
 *   value : 'hello',
 *   validity : Validity.Valid,
 *   messages : []
 * }
 * 
 * // also valid - all other properties can be combined in any way
 * const alsoValid : ControlledExcludableFieldState<string> = {
 *   visited : true,
 *   exclude : true
 * }
 * ```
 */
export type ControlledExcludableFieldState<Value> =
  | (StateWithMessages<Value> & Partial<InteractableState & ExcludableState>)
  | Partial<InteractableState & ExcludableState>;