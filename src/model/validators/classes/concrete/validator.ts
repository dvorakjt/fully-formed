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
 * Provides synchronous validation of a given type of value.
 */
export class Validator<Value> extends AbstractValidator<Value> {
  private predicate: Predicate<Value>;
  private invalidMessage?: string;
  private validMessage?: string;

  /**
   * @typeParam Value - The type of value that the validator is expected to validate.
   * @param ValidatorConstructorArgs - An object containing the required property `predicate` and the optional properties `validMessage` and `invalidMessage`.
   */
  public constructor({
    predicate,
    invalidMessage,
    validMessage,
  }: ValidatorConstructorArgs<Value>) {
    super();
    this.predicate = predicate;
    this.invalidMessage = invalidMessage;
    this.validMessage = validMessage;
  }

  /**
   * Validates the provided value and returns a {@link ValidatorResult} object.
   *
   * @param value - The value to be validated.
   * @returns A {@link ValidatorResult} object representing the validity of the value and, optionally, an associated {@link Message}.
   */
  public validate(value: Value): ValidatorResult {
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
