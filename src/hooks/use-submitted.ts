import { usePipe } from './use-pipe';
import type { Submittable } from '../model';

export function useSubmitted<T extends Submittable>(entity: T): boolean {
  return usePipe<T, boolean>(entity, state => state.submitted);
}
