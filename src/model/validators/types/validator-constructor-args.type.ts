import type { Predicate } from './predicate.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Message } from '../../state';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ValidatorResult } from './validator-result.type';

export type ValidatorConstructorArgs<Value> = {
  /**
   * A function that takes in a value and and returns true if the value is valid, and false otherwise.
   *
   * @param value - A value that will be validated by the predicate.
   * @returns `true` if the provided value is valid, `false` otherwise.
   *
   * @example
   * ```
   * //A predicate that determines whether a string represents a valid date.
   * const isDate : Predicate<string> = value => !Number.isNaN(new Date(value).getTime());
   * ```
   */
  predicate: Predicate<Value>;
  /**
   * Represents the text of a {@link Message} returned as part of the {@link ValidatorResult} object when the Validator's `validate()` method determines the provided value to be valid. If omitted, no message will accompany a valid result.
   *
   * @example
   * ```
   * // A Validator that determines whether a password field includes an uppercase letter.
   * const includesUpper = new Validator<string>({
   *   predicate : value => /[A-Z]/.test(value),
   *   validMessage : 'The password includes an uppercase letter.',
   *   invalidMessage : 'The password must include an uppercase letter.'
   * });
   * ```
   */
  validMessage?: string;
  /**
   * Represents the text of a {@link Message} returned as part of the {@link ValidatorResult} object when the Validator's `validate()` method determines the provided value to be invalid. If omitted, no message will accompany an invalid result.
   *
   * @example
   * ```
   * // A Validator that determines whether a password field includes an uppercase letter.
   * const includesUpper = new Validator<string>({
   *   predicate : value => /[A-Z]/.test(value),
   *   validMessage : 'The password includes an uppercase letter.',
   *   invalidMessage : 'The password must include an uppercase letter.'
   * });
   * ```
   */
  invalidMessage?: string;
};
