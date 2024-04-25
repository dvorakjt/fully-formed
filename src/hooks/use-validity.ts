import { useState, useEffect } from 'react';
import type { Stateful, State, Validity } from '../model';

export function useValidity<T extends Stateful<State<unknown>>>(
  validatedEntity: T,
): Validity {
  const [validity, setValidity] = useState(validatedEntity.state.validity);

  useEffect(() => {
    const subscription = validatedEntity.subscribeToState(newState => {
      setValidity(newState.validity);
    });
    return () => subscription.unsubscribe();
  }, []);

  return validity;
}
