import type { Message, Validity } from '../../shared';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IValidator, IAsyncValidator } from '../interfaces';

/**
 * An object returned by the `validate` method of an {@link IValidator} or
 * the Promise returned by the `validate` method of an {@link IAsyncValidator}.
 * It contains the determined {@link Validity} of the value provided to the
 * `validate` method and, optionally, an associated {@link Message}.
 */
export type ValidatorResult = {
  validity: Validity;
  message?: Message;
};
