import type { Validity } from '../../shared';
import type { Message } from '../../shared';

export interface SetValidityAndMessages {
  setValidityAndMessages(validity: Validity, messages: Message[]): void;
}
