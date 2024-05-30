import { Validator } from './validator';
import { EmailRegExp } from './email-regexp';
import type { IValidator } from '../interfaces';
import type { Predicate } from '../types';

type ValidatorMessages = {
  validMessage?: string;
  invalidMessage?: string;
};

type TrimBeforeValidation = {
  trimBeforeValidation?: boolean;
};

export class StringValidators {
  private static readonly EMAIL_REGEXP = new EmailRegExp();

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
