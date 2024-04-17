import { useState, useEffect } from 'react';
import type { Stateful } from '../model';

/**
 * Takes in an instance of a class implementing the {@link Stateful} interface
 * and returns a React state variable containing the `state` property of the
 * instance.
 *
 * @param statefulEntity - An instance of a class that implements the
 * {@link Stateful} interface to which the hook will subscribe.
 *
 * @returns A React state variable containing the `state` property of the
 * `statefulEntity`.
 *
 * @remarks
 * The variable returned by this hook will be updated whenever the `state`
 * property of the `statefulEntity` changes.
 */
export function useStatefulEntityState<T extends Stateful<unknown>>(
  statefulEntity: T,
): T['state'] {
  const [state, setState] = useState(statefulEntity.state);

  useEffect(() => {
    const subscription = statefulEntity.subscribeToState(newState => {
      setState(newState);
    });
    return () => subscription.unsubscribe();
  }, []);

  return state;
}
