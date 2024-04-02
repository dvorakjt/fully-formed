import type { FormElement } from '../../form-elements';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DefaultAdapter, DefaultExcludableAdapter } from '../classes';

/**
 * A function that takes in a value of a given type and returns a value of the
 * same type.
 *
 * @typeParam Source - A {@link FormElement} whose value the function expects
 * to receive and adapt.
 *
 * @remarks
 * The value of a {@link DefaultAdapter} or {@link DefaultExcludableAdapter} is
 * produced by calling this function against the value of its source.
 */
export type DefaultAdaptFn<Source extends FormElement> = (
  sourceValue: Source['state']['value'],
) => Source['state']['value'];
