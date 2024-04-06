import type { Observable } from 'rxjs';
import type { ValidatorResult } from '../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Message } from '../../../state';

/**
 * Provides asynchronous validation for a given type of value.
 *
 * @typeParam T - The type of value that the validator can validate.
 */
export abstract class AbstractAsyncValidator<T> {
  /**
   * Asynchronously validates the provided value.
   *
   * @param value - The value to be validated.
   *
   * @returns An {@link Observable}\<{@link ValidatorResult}\>. The object it
   * emits to subscribers represents the validity of the value and, optionally,
   * an associated {@link Message}.
   */
  public abstract validate(value: T): Observable<ValidatorResult>;
}
