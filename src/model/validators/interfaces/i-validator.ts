import type { ValidatorResult } from '../types';

/**
 * Exposes a validate method which can be used to determine the validity of
 * a certain type of value.
 *
 * @typeParam T - The type of value which can be validated.
 */
export interface IValidator<T> {
  /**
   * Validates a value of type `T` and returns a {@link ValidatorResult}.
   *
   * @param value - The value to validate.
   */
  validate(value: T): ValidatorResult;
}
