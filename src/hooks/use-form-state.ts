import { useStatefulEntityState } from './use-stateful-entity-state';
import type { AbstractForm, FormConstituents } from '../model';

export function useFormState<T extends AbstractForm<string, FormConstituents>>(
  form: T,
): T['state'] {
  return useStatefulEntityState(form);
}
