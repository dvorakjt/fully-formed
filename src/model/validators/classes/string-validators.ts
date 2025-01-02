import { Validator } from './validator';
import { EmailRegExp } from './email-regexp';
import type { IValidator } from '../interfaces';
import type { Predicate } from '../types';

/**
 * A configuration object provided to the factory methods of
 * {@link StringValidators} in order to set the messages that will be returned
 * by the resulting validator's `validate` method.
 */
type ValidatorMessages = {
  validMessage?: string;
  invalidMessage?: string;
};

/**
 * A partial configuration object that can be provided to the factory methods of
 * {@link StringValidators}. If `trimBeforeValidation` is true, the value will
 * be trimmed before the returned validator validates it.
 *
 * @remarks
 * This flag is useful when using the `autotrim` property of forms.
 */
type TrimBeforeValidation = {
  trimBeforeValidation?: boolean;
};

/**
 * A class with static factory methods for instantiating validators that
 * evaluate strings against common validation requirements.
 */
export class StringValidators {
  private static readonly EMAIL_REGEXP = new EmailRegExp();

  /**
   * Returns a validator that passes if the value it receives is not an empty
   * string. Depending on the config object it receives, the value may be
   * trimmed before performing this check.
   *
   * @param args - An object of type {@link ValidatorMessages} `&` {@link TrimBeforeValidation}.
   * @returns An {@link IValidator}`<string>`.
   */
  public static required(
    args?: ValidatorMessages & TrimBeforeValidation,
  ): IValidator<string> {
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
   * Returns a validator that passes if the value it receives is a valid email
   * address. Depending on the config object it receives, the value may be
   * trimmed before performing this check.
   *
   * @param args - An object of type {@link ValidatorMessages} `&` {@link TrimBeforeValidation}.
   * @returns An {@link IValidator}`<string>`.
   *
   * @remarks
   * See {@link EmailRegExp} for details about the criteria that must be met
   * for the email address to be valid.
   */
  public static email(
    args?: ValidatorMessages & TrimBeforeValidation,
  ): IValidator<string> {
    const predicate: Predicate<string> = value => {
      return this.EMAIL_REGEXP.test(
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
   * Returns a validator that passes if the value it receives includes an
   * uppercase character.
   *
   * @param args - An object of type {@link ValidatorMessages}.
   * @returns An {@link IValidator}`<string>`.
   */
  public static includesUpper(args?: ValidatorMessages): IValidator<string> {
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
   * Returns a validator that passes if the value it receives includes a
   * lowercase character.
   *
   * @param args - An object of type {@link ValidatorMessages}.
   * @returns An {@link IValidator}`<string>`.
   */
  public static includesLower(args?: ValidatorMessages): IValidator<string> {
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
   * Returns a validator that passes if the value it receives includes a
   * digit.
   *
   * @param args - An object of type {@link ValidatorMessages}.
   * @returns An {@link IValidator}`<string>`.
   */
  public static includesDigit(args?: ValidatorMessages): IValidator<string> {
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
   * Returns a validator that passes if the value it receives includes a
   * symbol.
   *
   * @param args - An object of type {@link ValidatorMessages}.
   * @returns An {@link IValidator}`<string>`.
   *
   * Symbols include:
   * !"#$%&'()*+,-./\\:;\<=\>?\@[]^_\`\{|\}~
   */
  public static includesSymbol(args?: ValidatorMessages): IValidator<string> {
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
   * Returns a validator that passes if the value it receives matches the
   * provided regular expression. Depending on the options it receives, the
   * value may be trimmed before performing this check.
   *
   * @param pattern - A regular expression that the validator will test values
   * against.
   *
   * @param opts - An object of type {@link ValidatorMessages} `&` {@link TrimBeforeValidation}.
   * @returns An {@link IValidator}`<string>`.
   */
  public static pattern(
    pattern: RegExp,
    opts?: ValidatorMessages & TrimBeforeValidation,
  ): IValidator<string> {
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
   * Returns a validator that passes if the value it receives has a length
   * greater than or equal to the provided minimum. Depending on the options it
   * receives, the value may be trimmed before performing this check.
   *
   * @param length - The minimum length mandated by the validator.
   * @param opts - An object of type {@link ValidatorMessages} `&` {@link TrimBeforeValidation}.
   * @returns An {@link IValidator}`<string>`.
   */
  public static minLength(
    minLength: number,
    opts?: ValidatorMessages & TrimBeforeValidation,
  ): IValidator<string> {
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
   * Returns a validator that passes if the value it receives has a length
   * less than or equal to the provided maximum. Depending on the options it
   * receives, the value may be trimmed before performing this check.
   *
   * @param length - The maximum length allowed by the validator.
   * @param opts - An object of type {@link ValidatorMessages} `&` {@link TrimBeforeValidation}.
   * @returns An {@link IValidator}`<string>`.
   */
  public static maxLength(
    maxLength: number,
    opts?: ValidatorMessages & TrimBeforeValidation,
  ): IValidator<string> {
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
