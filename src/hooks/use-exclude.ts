import { usePipe } from './use-pipe';
import type { Excludable } from '../model';

export function useExclude<T extends Excludable>(entity: T): boolean {
  return usePipe<T, boolean>(entity, state => state.exclude);
}
