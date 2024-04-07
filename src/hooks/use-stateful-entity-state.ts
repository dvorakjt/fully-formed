import { useState, useLayoutEffect } from 'react';
import type { Stateful } from '../model';

export function useStatefulEntityState<T extends Stateful<unknown>>(
  statefulEntity: T,
): T['state'] {
  const [state, setState] = useState(statefulEntity.state);

  useLayoutEffect(() => {
    const subscription = statefulEntity.subscribeToState(newState => {
      setState(newState);
    });
    return () => subscription.unsubscribe();
  }, []);

  return state;
}
