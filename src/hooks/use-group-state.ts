import { useStatefulEntityState } from './use-stateful-entity-state';
import type { AbstractGroup, GroupMembers } from '../model';

export function useGroupState<T extends AbstractGroup<string, GroupMembers>>(
  group: T,
): T['state'] {
  return useStatefulEntityState(group);
}
