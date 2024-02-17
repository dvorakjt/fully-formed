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

export class StringValidators {
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
  public static containsUpper(
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
