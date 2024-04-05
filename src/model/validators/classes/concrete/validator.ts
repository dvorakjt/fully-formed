import { AbstractValidator } from '../abstract';
import { Validity } from '../../../state';
import type {
  ValidatorResult,
  ValidatorConstructorArgs,
  Predicate,
} from '../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Message } from '../../../state';

/**
 * Provides synchronous validation for a given type of value.
 * 
 * @typeParam T - The type of value that the validator can validate.
 */
export class Validator<T> extends AbstractValidator<T> {
  private predicate: Predicate<T>;
  private invalidMessage?: string;
  private validMessage?: string;

  public constructor({
    predicate,
    invalidMessage,
    validMessage,
  }: ValidatorConstructorArgs<T>) {
    super();
    this.predicate = predicate;
    this.invalidMessage = invalidMessage;
    this.validMessage = validMessage;
  }

  /**
   * Validates the provided value.
   *
   * @param value - The value to be validated.
   * 
   * @returns A {@link ValidatorResult} object representing the validity of the 
   * value and, optionally, an associated {@link Message}.
   */
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
