import { useStatefulEntityState } from './use-stateful-entity-state';
import type { AbstractGroup, GroupMembers } from '../model';

/**
 * Takes in an {@link AbstractGroup} and returns a React state variable
 * containing the `state` property of the group.
 *
 * @param group - The {@link AbstractGroup} to which the hook will subscribe.
 *
 * @returns A React state variable containing the `state` property of the
 * group.
 *
 * @remarks
 * The variable returned by this hook will be updated whenever the `state`
 * property of the group changes.
 */
export function useGroupState<T extends AbstractGroup<string, GroupMembers>>(
  group: T,
): T['state'] {
  return useStatefulEntityState(group);
}
