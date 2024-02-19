import type { Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { StateWithMessages, Validity, Message } from '../../../state';

/**
 * Manages the validation of a value of a given type against a collection of async validators.
 */
export abstract class AbstractAsyncValidatorSuite<T> {

  /**
   * Validates the provided value against a collection of validators.
   *
   * @param value - The value to be validated.
   * @returns An {@link Observable} that emits an object containing the provided value, its {@link Validity}, and an array of associated {@link Message}s.
   */
  public abstract validate(value: T): Observable<StateWithMessages<T>>;
}
