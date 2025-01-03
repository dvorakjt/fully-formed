import { Observable } from 'rxjs';
import { Validity } from '../../shared';
import type { IAsyncValidator } from '../interfaces';
import type { AsyncPredicate, ValidatorResult } from '../types';

/**
 * A configuration object expected by the constructor of an
 * {@link AsyncValidator}.
 *
 * @typeParam T - The type of value the validator will be able to validate.
 */
export type AsyncValidatorConstructorParams<T> = {
  /**
   * A function that returns a Promise that resolves to a boolean indicating
   * whether or not the provided value is valid.
   */
  predicate: AsyncPredicate<T>;
  /**
   * A message that is emitted as part of a valid {@link ValidatorResult}.
   */
  validMessage?: string;
  /**
   * A message that is emitted as part of an invalid {@link ValidatorResult}.
   */
  invalidMessage?: string;
};

/**
 * Exposes a validate method which can be used to asynchronously determine the
 * validity of a value of a certain type.
 *
 * @typeParam T - The type of value which can be validated.
 */
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

  /**
   * Validates a value of type `T` and returns an RxJS Observable
   * which resolves emits a {@link ValidatorResult}.
   *
   * @param value - The value to validate.
   */
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
