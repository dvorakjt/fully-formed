import { usePipe } from './use-pipe';
import type { Validated, Validity } from '../model';

export function useValidity<T extends Validated<unknown>>(entity: T): Validity {
  return usePipe<T, Validity>(entity, state => state.validity);
}
