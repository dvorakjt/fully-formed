import { useStatefulEntityState } from './use-stateful-entity-state';
import type { AbstractForm, FormConstituents } from '../model';

/**
 * Takes in an {@link AbstractForm} and returns a React state variable
 * containing the `state` property of the form.
 *
 * @param form - The {@link AbstractForm} to which the hook will subscribe.
 *
 * @returns A React state variable containing the `state` property of the
 * form.
 *
 * @remarks
 * The variable returned by this hook will be updated whenever the `state`
 * property of the form changes.
 */
export function useFormState<T extends AbstractForm<string, FormConstituents>>(
  form: T,
): T['state'] {
  return useStatefulEntityState(form);
}
