import type { Message, Validity } from '../../state';

export type ValidatorResult = {
  validity: Validity;
  message?: Message;
};
