import { Observable } from 'rxjs';
import { Validity } from '../../shared';
import type { IAsyncValidator } from '../interfaces';
import type { AsyncPredicate, ValidatorResult } from '../types';

export type AsyncValidatorConstructorParams<T> = {
  predicate: AsyncPredicate<T>;
  validMessage?: string;
  invalidMessage?: string;
};

export class AsyncValidator<T> implements IAsyncValidator<T> {
  private predicate: AsyncPredicate<T>;
  private validMessage?: string;
  private invalidMessage?: string;

  public constructor({
    predicate,
    validMessage,
    invalidMessage,
  }: AsyncValidatorConstructorParams<T>) {
    this.predicate = predicate;
    this.validMessage = validMessage;
    this.invalidMessage = invalidMessage;
  }

  public validate(value: T): Observable<ValidatorResult> {
    return new Observable<ValidatorResult>(subscriber => {
      this.predicate(value).then(isValid => {
        const result: ValidatorResult = {
          validity: isValid ? Validity.Valid : Validity.Invalid,
        };
        if (result.validity === Validity.Valid && this.validMessage) {
          result.message = {
            text: this.validMessage,
            validity: Validity.Valid,
          };
        } else if (
          result.validity === Validity.Invalid &&
          this.invalidMessage
        ) {
          result.message = {
            text: this.invalidMessage,
            validity: Validity.Invalid,
          };
        }
        subscriber.next(result);
        subscriber.complete();
      });
    });
  }
}
