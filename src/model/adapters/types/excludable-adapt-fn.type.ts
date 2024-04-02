import type { FormElement } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableAdaptFnReturnType } from './excludable-adapt-fn-return-type.type';

/**
 * A function that takes in the state of a form element or group and produces
 * an {@link ExcludableAdaptFnReturnType} object.
 *
 * @typeParam Source - A {@link FormElement} or {@link AbstractGroup} whose
 * state the function expects to receive.
 *
 * @typeParam Value - The type of value that the function produces.
 *
 * @remarks
 * The `value` and `exclude` properties of the returned object are assigned to
 * the corresponding properties of the state of an excludable adapter.
 */
export type ExcludableAdaptFn<
  Source extends FormElement | AbstractGroup<string, GroupMembers>,
  Value,
> = (sourceState: Source['state']) => ExcludableAdaptFnReturnType<Value>;
