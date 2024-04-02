import type { FormElement } from '../../form-elements';
import type { DefaultAdaptFn } from './default-adapt-fn.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DefaultAdapter, DefaultExcludableAdapter } from '../classes';

/**
 * An object passed as an argument to the constructor of a
 * {@link DefaultAdapter} or {@link DefaultExcludableAdapter}.
 *
 * @typeParam Source - A {@link FormElement} whose state the adapter will
 * subscribe to and adapt. The Name of the adapter and the type of value it will
 * produce are also identical to those of its source.
 */
export type DefaultAdapterConstructorArgs<Source extends FormElement> = {
  /**
   * A {@link FormElement} whose state the adapter will
   * subscribe to and adapt. The Name of the adapter and the type of value it
   * will produce are also identical to those of its source.
   */
  source: Source;
  /**
   * A function that takes in a value of a given type and returns a value of the
   * same type. The value of the adapter is produced by calling this function
   * against the value of its source.
   */
  adaptFn?: DefaultAdaptFn<Source>;
};
