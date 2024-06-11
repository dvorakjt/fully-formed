import { useState, useEffect } from 'react';
import type { Stateful } from '../model';

/**
 * Accepts an instance of a class that implements {@link Stateful} and returns
 * the state of that entity as a React state variable. The value of this
 * variable will be updated whenever the state of the provided entity changes.
 *
 * @param entity - A {@link Stateful} entity whose state should be subscribed to.
 *
 * @returns A React state variable representing the current state of the
 * provided entity.
 */
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
