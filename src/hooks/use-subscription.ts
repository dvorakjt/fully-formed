import { useState, useEffect } from 'react';
import type { Stateful } from '../model';

export function useSubscription<T extends Stateful>(entity: T): T['state'] {
  const [state, setState] = useState(entity.state);

  useEffect(() => {
    const subscription = entity.subscribeToState(newState => {
      setState(newState);
    });
    return (): void => subscription.unsubscribe();
  }, []);

  return state;
}
