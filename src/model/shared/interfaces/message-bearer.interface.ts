import type { Message } from '../types';
import type { Stateful } from './stateful.interface';

export type MessageBearerState = {
  messages: Message[];
};

export interface MessageBearer extends Stateful<MessageBearerState> {}
