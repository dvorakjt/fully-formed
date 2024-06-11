import { usePipe } from './use-pipe';
import type { Excludable } from '../model';

/**
 * Accepts an instance of a class that implements {@link Excludable} and
 * returns a React state variable indicating whether or not that entity is
 * currently excluded.
 *
 * @param entity - The {@link Excludable} entity whose state should be
 * subscribed to.
 *
 * @returns A React state variable of type `boolean`.
 */
export function useExclude<T extends Excludable>(entity: T): boolean {
  return usePipe<T, boolean>(entity, state => state.exclude);
}
