import { useState, useEffect } from 'react';
import type { Stateful, ArrayOfStates } from '../model';

type MultiEntityTransformFn<T extends readonly Stateful[], V> = (
  states: ArrayOfStates<T>,
) => V;

export function useMultiPipe<const T extends readonly Stateful[], V>(
  entities: T,
  transformFn: MultiEntityTransformFn<T, V>,
): V {
  const [pipedValue, setPipedValue] = useState(
    transformFn(toArrayOfStates(entities)),
  );

  useEffect(() => {
    const subscriptions = entities.map(entity => {
      return entity.subscribeToState(() => {
        setPipedValue(transformFn(toArrayOfStates(entities)));
      });
    });

    return (): void => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, []);

  return pipedValue;
}

function toArrayOfStates<T extends readonly Stateful[]>(
  entities: T,
): ArrayOfStates<T> {
  return entities.map(entity => entity.state) as ArrayOfStates<T>;
}
