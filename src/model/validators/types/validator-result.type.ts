import type { Message, Validity } from '../../shared';

export type ValidatorResult = {
  validity: Validity;
  message?: Message;
};
