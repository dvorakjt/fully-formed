import { usePipe } from './use-pipe';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Excludable, ExcludableField } from '../model';

/**
 * Takes in an instance of a class that implements {@link Excludable} and
 * returns a boolean React state variable indicating whether or not that
 * entity is currently excluded.
 *
 * @param entity - The {@link Excludable} entity whose exclude property should
 * be tracked, e.g. an {@link ExcludableField}.
 *
 * @returns A React state variable of type boolean.
 */
export function useExclude<T extends Excludable>(entity: T): boolean {
  return usePipe<T, boolean>(entity, state => state.exclude);
}
