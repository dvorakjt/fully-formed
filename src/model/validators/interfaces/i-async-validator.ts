import type { Observable } from 'rxjs';
import type { ValidatorResult } from '../types';

/**
 * Exposes a validate method which can be used to asynchronously determine the
 * validity of a value of a certain type.
 *
 * @typeParam T - The type of value which can be validated.
 */
export interface IAsyncValidator<T> {
  /**
   * Validates a value of type `T` and returns a Promise or RxJS Observable
   * which resolves with/emits a {@link ValidatorResult}.
   *
   * @param value - The value to validate.
   */
  validate(value: T): Promise<ValidatorResult> | Observable<ValidatorResult>;
}
