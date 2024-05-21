import { Validity } from '../../shared';
import type { IValidator } from '../interfaces';
import type { ValidatorResult, Predicate } from '../types';

export type ValidatorConstructorParams<T> = {
  predicate: Predicate<T>;
  validMessage?: string;
  invalidMessage?: string;
};

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
