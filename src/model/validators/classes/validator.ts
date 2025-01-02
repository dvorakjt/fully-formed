import { Validity } from '../../shared';
import type { IValidator } from '../interfaces';
import type { ValidatorResult, Predicate } from '../types';

/**
 * A configuration object expected by the constructor of a {@link Validator}.
 *
 * @typeParam T - The type of value that the validator will be able to validate.
 */
export type ValidatorConstructorParams<T> = {
  /**
   * A function that returns `true` if the value it receives is valid.
   */
  predicate: Predicate<T>;
  /**
   * A message that is returned as part of a valid {@link ValidatorResult}.
   */
  validMessage?: string;
  /**
   * A message that is returned as part of an invalid {@link ValidatorResult}.
   */
  invalidMessage?: string;
};

/**
 * Exposes a validate method which can be used to determine the validity of a certain type of value.
 *
 * @typeParam T - The type of value which can be validated.
 */
export class Validator<T> implements IValidator<T> {
  private predicate: Predicate<T>;
  private validMessage?: string;
  private invalidMessage?: string;

  public constructor({
    predicate,
    validMessage,
    invalidMessage,
  }: ValidatorConstructorParams<T>) {
    this.predicate = predicate;
    this.invalidMessage = invalidMessage;
    this.validMessage = validMessage;
  }

  public validate(value: T): ValidatorResult {
    const result: ValidatorResult = {
      validity: this.predicate(value) ? Validity.Valid : Validity.Invalid,
    };
    if (result.validity === Validity.Valid && this.validMessage) {
      result.message = {
        text: this.validMessage,
        validity: Validity.Valid,
      };
    } else if (result.validity === Validity.Invalid && this.invalidMessage) {
      result.message = {
        text: this.invalidMessage,
        validity: Validity.Invalid,
      };
    }
    return result;
  }
}
