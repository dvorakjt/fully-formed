import { Validator } from '../concrete';
import { EmailRegExp } from '../../../shared';
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
 * A static class whose methods return validators with pre-defined predicates
 * for various common string validation requirements.
 */
export class StringValidators {
  private static readonly EMAIL_REGEXP = new EmailRegExp();

  /**
   * Returns a validator that checks if a string is not empty.
   *
   * @param args - An object with optional properties `validMessage`,
   * `invalidMessage`, and `trimBeforeValidation`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>.
   *
   * @remarks
   * If `trimBeforeValidation` is set to true in the object passed into this
   * method, the string will be trimmed and then evaluated. This is useful when
   * `autoTrim` has been enabled for the field containing this validator.
   */
  public static required(
    args?: ValidatorMessages & TrimBeforeValidation,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return args?.trimBeforeValidation ?
          value.trim().length > 0
        : value.length > 0;
    };
    return new Validator<string>({
      predicate,
      validMessage: args?.validMessage,
      invalidMessage: args?.invalidMessage,
    });
  }

  /**
   * Returns a validator that checks if a string is a valid email address.
   *
   * @param args - An object with optional properties `validMessage`,
   * `invalidMessage`, and `trimBeforeValidation`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>.
   *
   * @remarks
   * The following requirements have been implemented:
   * - The local part of the email must be between 1 and 64 characters in
   * length.
   * - The length of the domain must be between 4 and 255 characters in length.
   * - The local part can consist of printable characters separated by a period.
   * Periods must not occur consecutively or at the beginning or end of the
   * local part. Printable characters are:
   *   - Alphanumeric characters
   *   - Any of the following symbols: !#$%&'*+-/=?^_\`\{|\}~
   * - The domain consists of DNS labels separated by periods.
   * - Each DNS label may be between 1 and 63 characters in length.
   * - Each DNS label may consist of alphanumeric characters and hyphens,
   * provided it is not comprised only of numbers, does not start or end with a
   * hyphen, and does not include consecutive hyphens.
   * - The top-level domain must consist of 2 or more alphabetical characters.
   *
   * Please see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696) for
   * more information.
   *
   * If `trimBeforeValidation` is set to true in the object passed into this
   * method, the string will be trimmed and then evaluated. This is useful when
   * `autoTrim` has been enabled for the field containing this validator.
   */
  public static email(
    args?: ValidatorMessages & TrimBeforeValidation,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return StringValidators.EMAIL_REGEXP.test(
        args?.trimBeforeValidation ? value.trim() : value,
      );
    };
    return new Validator<string>({
      predicate,
      validMessage: args?.validMessage,
      invalidMessage: args?.invalidMessage,
    });
  }

  /**
   * Returns a validator that checks if a string contains an uppercase letter
   * (A-Z).
   *
   * @param args - An object with optional properties `validMessage` and
   * `invalidMessage`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>
   */
  public static includesUpper(
    args?: ValidatorMessages,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return /[A-Z]/.test(value);
    };
    return new Validator<string>({
      predicate,
      validMessage: args?.validMessage,
      invalidMessage: args?.invalidMessage,
    });
  }

  /**
   * Returns a validator that checks if a string contains a lowercase letter
   * (a-z).
   *
   * @param args - An object with optional properties `validMessage` and
   * `invalidMessage`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>
   */
  public static includesLower(
    args?: ValidatorMessages,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return /[a-z]/.test(value);
    };
    return new Validator<string>({
      predicate,
      validMessage: args?.validMessage,
      invalidMessage: args?.invalidMessage,
    });
  }

  /**
   * Returns a validator that checks if a string contains a digit.
   *
   * @param args - An object with optional properties `validMessage` and
   * `invalidMessage`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>
   */
  public static includesDigit(
    args?: ValidatorMessages,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return /\d/.test(value);
    };
    return new Validator<string>({
      predicate,
      validMessage: args?.validMessage,
      invalidMessage: args?.invalidMessage,
    });
  }

  /**
   * Returns a validator that checks if a string contains at least one of the
   * following symbols: !"#$%&'()*+,-./\\:;\<=\>?\@[\]^_\`\{|\}~
   *
   * @param args - An object with optional properties `validMessage` and
   * `invalidMessage`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>.
   */
  public static includesSymbol(
    args?: ValidatorMessages,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return /[!"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]/.test(value);
    };
    return new Validator<string>({
      predicate,
      validMessage: args?.validMessage,
      invalidMessage: args?.invalidMessage,
    });
  }

  /**
   * Returns a validator that checks if a string matches the provided regular
   * expression.
   *
   * @param args - An object with the required property `pattern` and optional
   * properties `validMessage`, `invalidMessage`, and `trimBeforeValidation`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>.
   */
  public static pattern(
    pattern: RegExp,
    opts?: ValidatorMessages & TrimBeforeValidation,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      return pattern.test(opts?.trimBeforeValidation ? value.trim() : value);
    };
    return new Validator<string>({
      predicate,
      validMessage: opts?.validMessage,
      invalidMessage: opts?.invalidMessage,
    });
  }

  /**
   * Returns a validator that checks if the length of a string is greater than
   * or equal to the minimum length it receives.
   *
   * @param args - An object with the required property `minLength` and optional
   * properties `validMessage`, `invalidMessage`, and `trimBeforeValidation`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>.
   */
  public static minLength(
    minLength: number,
    opts?: ValidatorMessages & TrimBeforeValidation,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      if (opts?.trimBeforeValidation) value = value.trim();
      return value.length >= minLength;
    };

    return new Validator<string>({
      predicate,
      validMessage: opts?.validMessage,
      invalidMessage: opts?.invalidMessage,
    });
  }

  /**
   * Returns a validator that checks if the length of a string is less than or
   * equal to the maximum length it receives.
   *
   * @param args - An object with the required property `maxLength` and optional
   * properties `validMessage`, `invalidMessage`, and `trimBeforeValidation`.
   *
   * @returns An instance of {@link AbstractValidator}\<string\>.
   */
  public static maxLength(
    maxLength: number,
    opts?: ValidatorMessages & TrimBeforeValidation,
  ): AbstractValidator<string> {
    const predicate: Predicate<string> = value => {
      if (opts?.trimBeforeValidation) value = value.trim();
      return value.length <= maxLength;
    };

    return new Validator<string>({
      predicate,
      validMessage: opts?.validMessage,
      invalidMessage: opts?.invalidMessage,
    });
  }
}
