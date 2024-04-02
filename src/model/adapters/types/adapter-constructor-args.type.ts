// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement, FormValue } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { AdaptFn } from './adapt-fn.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Adapter } from '../classes';

/**
 * An object passed as an argument to the constructor of an {@link Adapter}.
 *
 * @typeParam Name - A string literal which will be the key given to the adapted
 * value within a {@link FormValue} object.
 *
 * @typeParam Source - A {@link FormElement} or {@link AbstractGroup} whose
 * state the adapter will subscribe to and adapt.
 *
 * @typeParam Value - The type of value that the adapter produces.
 */
export type AdapterConstructorArgs<
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
   * a value. The value of an adapter is produced by calling this function
   * against the state of its source.
   */
  adaptFn: AdaptFn<Source, Value>;
};
