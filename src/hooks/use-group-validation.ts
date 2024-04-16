import { useRef, useState, useLayoutEffect } from 'react';
import {
  GroupValiditySource,
  Validity,
  type AbstractGroup,
  type GroupMembers,
} from '../model';
import type { Subscription } from 'rxjs';

export function useGroupValidation(
  ...groups: Array<AbstractGroup<string, GroupMembers>>
): Validity {
  const invalidGroupsRef = useRef(
    new Set<string>(getInvalidGroupNames(groups)),
  );
  const pendingGroupsRef = useRef(
    new Set<string>(getPendingGroupNames(groups)),
  );

  const [validity, setValidity] = useState<Validity>(
    getValidity(invalidGroupsRef.current, pendingGroupsRef.current),
  );

  useLayoutEffect(() => {
    const subscriptions: Subscription[] = [];
    groups.forEach(group => {
      const subscription = group.subscribeToState(state => {
        if (
          state.validity === Validity.Invalid &&
          state.validitySource === GroupValiditySource.Validation
        ) {
          invalidGroupsRef.current.add(group.name);
        } else {
          invalidGroupsRef.current.delete(group.name);
        }
        if (
          state.validity === Validity.Pending &&
          state.validitySource === GroupValiditySource.Validation
        ) {
          pendingGroupsRef.current.add(group.name);
        } else {
          pendingGroupsRef.current.delete(group.name);
        }
        setValidity(
          getValidity(invalidGroupsRef.current, pendingGroupsRef.current),
        );
      });
      subscriptions.push(subscription);
    });
    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  return validity;
}

function getInvalidGroupNames(
  groups: Array<AbstractGroup<string, GroupMembers>>,
): string[] {
  return groups
    .filter(
      group =>
        group.state.validity === Validity.Invalid &&
        group.state.validitySource === GroupValiditySource.Validation,
    )
    .map(group => group.name);
}

function getPendingGroupNames(
  groups: Array<AbstractGroup<string, GroupMembers>>,
): string[] {
  return groups
    .filter(
      group =>
        group.state.validity === Validity.Pending &&
        group.state.validitySource === GroupValiditySource.Validation,
    )
    .map(group => group.name);
}

function getValidity(
  invalidGroups: Set<string>,
  pendingGroups: Set<string>,
): Validity {
  if (invalidGroups.size) return Validity.Invalid;
  if (pendingGroups.size) return Validity.Pending;
  return Validity.Valid;
}
