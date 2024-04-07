import type { State } from './state.type';
import type { Message } from './message.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Validity } from '../enums';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AbstractField, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AbstractForm, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} from '../../form-elements';

/**
 * Represents the state of classes, such as {@link AbstractForm} or 
 * {@link AbstractField}, which must maintain synchronized `value`, `validity` 
 * and `messages` properties.
 * 
 * @remarks
 * This object ties value, validity, and messages together. Each state object 
 * can be considered to be immutable. Its properties are never mutated 
 * individually. Rather, a new state object replaces the old one. Because of 
 * this, you can be sure that a given value is always accompanied by an accurate 
 * {@link Validity} and an array of applicable {@link Message}s.
 */
export type StateWithMessages<Value> = State<Value> & {
  messages: Message[];
};
