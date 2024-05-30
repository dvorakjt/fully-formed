import { usePipe } from './use-pipe';
import type { Validated, ValueOf } from '../model';

export function useValue<T extends Validated<unknown>>(entity: T): ValueOf<T> {
  return usePipe<T, ValueOf<T>>(entity, state => state.value);
}
