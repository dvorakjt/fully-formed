import type {
  StateWithMessages,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Message,
} from '../../../state';

/**
 * Manages the validation of a value of a given type against a sequence of
 * validators.
 *
 * @typeParam T - The type of value that the suite can validate.
 */
export abstract class AbstractValidatorSuite<T> {
  /**
   * Validates the provided value against a collection of validators.
   *
   * @param value - The value to be validated.
   *
   * @returns An object containing the provided value, its validity, and array
   * of associated {@link Message}s.
   */
  public abstract validate(value: T): StateWithMessages<T>;
}
