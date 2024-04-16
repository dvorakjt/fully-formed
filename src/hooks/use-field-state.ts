import { useStatefulEntityState } from './use-stateful-entity-state';
import type { AbstractField } from '../model';

/**
 * Takes in an {@link AbstractField} and returns a React state variable
 * containing the `state` property of the field.
 *
 * @param field - The {@link AbstractField} to which the hook will subscribe.
 *
 * @returns A React state variable containing the `state` property of the
 * field.
 *
 * @remarks
 * The variable returned by this hook will be updated whenever the `state`
 * property of the field changes.
 */
export function useFieldState<
  T extends AbstractField<string, unknown, boolean>,
>(field: T): T['state'] {
  return useStatefulEntityState(field);
}
