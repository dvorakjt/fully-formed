import type { Validity } from '../enums';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ValidatorResult } from '../../validators';

/**
 * A message intended to be displayed to the end user. 
 * 
 * @remarks
 * Includes the text of the message. Also includes the {@link Validity} of the 
 * {@link ValidatorResult} object with which it was returned, in order to 
 * facilitate the application of appropriate CSS classes to individual messages.
 */
export type Message = {
  text: string;
  validity: Validity;
};
