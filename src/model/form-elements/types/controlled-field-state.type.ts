import type { InteractableState } from '../../shared';
import type { StateWithMessages } from '../../state';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FieldControlFn } from './field-control-fn.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Field } from '../classes';

/**
 * An object that can be returned by a {@link FieldControlFn}. The object is
 * then used to control the state of a {@link Field}.
 *
 * @typeParam Value - The type of value that the controlled {@link Field} holds.
 *
 * @remarks
 * If the object includes a `value`, `validity` or `messages` property, the
 * other two properties are also required.
 *
 * @example
 * ```
 * // not valid - `value` is included without `validity` and `messages`
 * const invalidState : ControlledFieldState<string> = {
 *   value : 'hello'
 * }
 *
 * // valid - `value`, `validity`, and `messages` are all present
 * const validState : ControlledFieldState<string> = {
 *   value : 'hello',
 *   validity : Validity.Valid,
 *   messages : []
 * }
 *
 * // also valid - all other properties can be combined in any way
 * const alsoValid : ControlledFieldState<string> = {
 *   visited : true,
 *   modified : true
 * }
 * ```
 */
export type ControlledFieldState<Value> =
  | (StateWithMessages<Value> & Partial<InteractableState>)
  | Partial<InteractableState>;
