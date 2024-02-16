import { AbstractValidator } from '../abstract';
import type { ValidatorResult } from '../../types';
import { Validity } from '../../../state';

type ValidatorConstructorArgs<Value> = {
  predicate: (value: Value) => boolean;
  invalidMessage?: string;
  validMessage?: string;
};

export class Validator<Value> extends AbstractValidator<Value> {
  private predicate: (value: Value) => boolean;
  private invalidMessage?: string;
  private validMessage?: string;

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

  public validate(value: Value): ValidatorResult<Value> {
    const result: ValidatorResult<Value> = {
      value,
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
