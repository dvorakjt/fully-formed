import { Observable } from 'rxjs';
import { AbstractAsyncValidator } from '../abstract';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Validity, type Message } from '../../../state';
import type {
  AsyncPredicate,
  AsyncValidatorConstructorArgs,
  ValidatorResult,
} from '../../types';

/**
 * Provides asynchronous validation for a given type of value.
 */
export class AsyncValidator<Value> extends AbstractAsyncValidator<Value> {
  private predicate: AsyncPredicate<Value>;
  private validMessage?: string;
  private invalidMessage?: string;

  /**
   * @typeParam Value - The type of value that the validator is expected to validate.
   * @param argsObject - {@link AsyncValidatorConstructorArgs}. An object containing an {@link AsyncPredicate} and, optionally, a `validMessage` and/or `invalidMessage`.
   */
  public constructor({
    predicate,
    validMessage,
    invalidMessage,
  }: AsyncValidatorConstructorArgs<Value>) {
    super();
    this.predicate = predicate;
    this.validMessage = validMessage;
    this.invalidMessage = invalidMessage;
  }

  /**
   * Asynchronously validates the provided value.
   *
   * @param value - The value to be validated.
   * @returns An {@link Observable}`<`{@link ValidatorResult}`>`. The object it emits to subscribers represents the validity of the value and, optionally, an associated {@link Message}.
   */
  public validate(value: Value): Observable<ValidatorResult> {
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
