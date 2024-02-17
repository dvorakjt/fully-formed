import type { ValidatorResult } from '../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Message } from '../../../state';

/**
 * Provides synchronous validation of a given type of value.
 */
export abstract class AbstractValidator<T> {
  /**
   * Validates the provided value and returns a {@link ValidatorResult} object.
   *
   * @param value - The value to be validated.
   * @returns A {@link ValidatorResult} object representing the validity of the value and, optionally, an associated {@link Message}.
   */
  public abstract validate(value: T): ValidatorResult;
}
