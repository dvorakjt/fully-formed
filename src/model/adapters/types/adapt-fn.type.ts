import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';

/**
 * A function that takes in the state of a form element or group and produces a
 * value.
 *
 * @typeParam Source - A {@link FormElement} or {@link AbstractGroup} whose
 * state the function expects to receive.
 *
 * @typeParam Value - The type of value that the function produces.
 *
 * @remarks
 * The value of an adapter is produced by calling this function against
 * the state of its source.
 */
export type AdaptFn<
  Source extends FormElement | AbstractGroup<string, GroupMembers>,
  Value,
> = (sourceState: Source['state']) => Value;
