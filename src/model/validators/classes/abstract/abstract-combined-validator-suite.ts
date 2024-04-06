import type { CombinedValidatorSuiteResult } from '../../types';

/**
 * Provides synchronous and asynchronous validation for a given type of value.
 *
 * @typeParam T - The type of value that the suite can validate.
 */
export abstract class AbstractCombinedValidatorSuite<T> {
  /**
   * Validates the provided value against both sync and async validators.
   *
   * @param value - The value to be validated.
   *
   * @returns An object containing a `syncResult` and possibly an
   * `observableResult`.
   */
  public abstract validate(value: T): CombinedValidatorSuiteResult<T>;
}
