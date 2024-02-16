import type { Message, State } from '../../state';

export type ValidatorResult<Value> = State<Value> & {
  message?: Message;
};
