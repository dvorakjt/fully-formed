import { useState, useEffect } from 'react';
import type { Stateful } from '../model';

type TransformFn<T extends Stateful, V> = (state: T['state']) => V;

export function usePipe<T extends Stateful, V>(
  entity: T,
  transformFn: TransformFn<T, V>,
): V {
  const [pipedValue, setPipedValue] = useState(transformFn(entity.state));

  useEffect(() => {
    const subscription = entity.subscribeToState(state => {
      setPipedValue(transformFn(state));
    });
    return (): void => subscription.unsubscribe();
  }, []);

  return pipedValue;
}
