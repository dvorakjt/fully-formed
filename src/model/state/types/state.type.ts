import type { Validity } from '../enums';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AbstractAdapter } from '../../adapters';

/**
 * Represents the state of classes, such as {@link AbstractAdapter}, which must
 * maintain synchronized `value` and `validity` properties.
 *
 * @remarks
 * The state object ties value and validity together. Each state object can be
 * considered to be immutable. Its properties are never mutated individually.
 * Rather, a new state object replaces the old one. Because of this, you can be
 * sure that a given value is always accompanied by an accurate
 * {@link Validity}.
 */
export type State<Value> = {
  value: Value;
  validity: Validity;
};
