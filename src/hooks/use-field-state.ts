import { useStatefulEntityState } from './use-stateful-entity-state';
import type { AbstractField } from '../model';

export function useFieldState<
  T extends AbstractField<string, unknown, boolean>,
>(field: T): T['state'] {
  return useStatefulEntityState(field);
}
