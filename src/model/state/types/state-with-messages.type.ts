import type { State } from './state.type';
import type { Message } from './message.type';

export type StateWithMessages<Value> = State<Value> & {
  messages: Message[];
};
