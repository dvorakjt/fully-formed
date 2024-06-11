import { usePipe } from './use-pipe';
import type { Validated, ValueOf } from '../model';

/**
 * Accepts an instance of a class that implements {@link Validated} and returns
 * a React state variable representing the entity's current value. The
 * returned variable is updated whenever the value of the provided entity
 * changes.
 *
 * @param entity - An instance of a class that implements {@link Validated}.
 *
 * @returns A React state variable of type {@link ValueOf}\<T\>.
 */
export function useValue<T extends Validated<unknown>>(entity: T): ValueOf<T> {
  return usePipe<T, ValueOf<T>>(entity, state => state.value);
}
