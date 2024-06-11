import { usePipe } from './use-pipe';
import type { Validated, Validity } from '../model';

/**
 * Accepts an instance of a class that implements {@link Validated} and returns
 * a React state variable representing the entity's current validity. The
 * returned variable is updated whenever the validity of the provided entity
 * changes.
 *
 * @param entity - An instance of a class that implements {@link Validated}.
 *
 * @returns A React state variable of type {@link Validity}.
 */
export function useValidity<T extends Validated<unknown>>(entity: T): Validity {
  return usePipe<T, Validity>(entity, state => state.validity);
}
