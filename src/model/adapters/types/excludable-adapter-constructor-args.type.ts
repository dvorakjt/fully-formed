// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement, FormValue } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableAdaptFn } from './excludable-adapt-fn.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableAdaptFnReturnType } from './excludable-adapt-fn-return-type.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableAdapter } from '../classes';

/**
 * An object passed as an argument to the constructor of an
 * {@link ExcludableAdapter}.
 *
 * @typeParam Name - A string literal which will be the key given to the adapted
 * value within a {@link FormValue} object.
 *
 * @typeParam Source - A {@link FormElement} or {@link AbstractGroup} whose
 * state the adapter will subscribe to and adapt.
 *
 * @typeParam Value - The type of value that the adapter produces.
 */
export type ExcludableAdapterConstructorArgs<
  Name extends string,
  Source extends FormElement | AbstractGroup<string, GroupMembers>,
  Value,
> = {
  /**
   * A string literal which will be the key given to the adapted value within a
   * {@link FormValue} object.
   */
  name: Name;
  /**
   * A {@link FormElement} or {@link AbstractGroup} whose state the adapter will
   * subscribe to and adapt.
   */
  source: Source;
  /**
   * A function that takes in the state of a form element or group and produces
   * an {@link ExcludableAdaptFnReturnType} object. The `value` and `exclude`
   * properties of the returned object are assigned to the corresponding
   * properties of the state of the adapter.
   */
  adaptFn: ExcludableAdaptFn<Source, Value>;
};
