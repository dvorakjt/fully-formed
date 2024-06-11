import { usePipe } from './use-pipe';
import type { Submittable } from '../model';

/**
 * Accepts an instance of a class that implements {@link Submittable} and
 * returns a React state variable indicating whether or not the entity has been
 * submitted.
 *
 * @param entity - The {@link Submittable} entity whose `state.submitted`
 * property should be tracked.
 *
 * @returns A React state variable of type `boolean`.
 */
export function useSubmitted<T extends Submittable>(entity: T): boolean {
  return usePipe<T, boolean>(entity, state => state.submitted);
}
