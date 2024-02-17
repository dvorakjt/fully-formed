import { Validator } from '../concrete';
import type { Predicate } from '../../types';
import type { AbstractValidator } from '../abstract';

type ValidatorMessages = {
  validMessage?: string;
  invalidMessage?: string;
};

type TrimBeforeValidation = {
  trimBeforeValidation?: boolean;
};

/**
 * A static class whose methods return validators with pre-defined predicates for various common string validation requirements.
 */
export class StringValidators {
  /**
   * Returns a validator that returns a valid result if the string is not empty.
   *
   * @remarks
   * If `trimBeforeValidation` is set to true in the object passed into this method, the string will be trimmed and then evaluated. This is useful when you plan to trim the string prior to submission of the form.
   *
   * @param argsObject - {@link ValidatorMessages} & {@link TrimBeforeValidation}. An object with optional properties `validMessage`, `invalidMessage`, and `trimBeforeValidation`.
   * @returns An instance of {@link AbstractValidator} whose Value type is of type `string`.
   */
  public static required(
    args?: ValidatorMessages & TrimBeforeValidation,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return args && args.trimBeforeValidation ?
          value.trim().length > 0
        : value.length > 0;
    };
    return new Validator<string>({
      predicate,
      validMessage: args && args.validMessage,
      invalidMessage: args && args.invalidMessage,
    });
  }

  /**
   * Returns a validator that returns a valid result if the string contains an uppercase letter (A-Z).
   *
   * @param argsObject - {@link ValidatorMessages}. An object with optional properties `validMessage` and `invalidMessage`.
   * @returns An instance of {@link AbstractValidator} whose Value type is of type `string`.
   */
  public static includesUpper(
    args?: ValidatorMessages,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return /[A-Z]/.test(value);
    };
    return new Validator<string>({
      predicate,
      validMessage: args && args.validMessage,
      invalidMessage: args && args.invalidMessage,
    });
  }
}
