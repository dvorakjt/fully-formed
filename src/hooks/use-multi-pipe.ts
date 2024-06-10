import { useState, useEffect } from 'react';
import type { Stateful, ArrayOfStates } from '../model';

type MultiEntityTransformFn<T extends readonly Stateful[], V> = (
  states: ArrayOfStates<T>,
) => V;

/**
 * Accepts an array of instances of classes that implement {@link Stateful} and
 * a `transformFn`, and returns a React state variable whose value is the result
 * of calling the `transformFn` with the states of those entities. If the
 * state(s) of any of those entities change, the function will be called again
 * and the returned React state variable will be updated.
 *
 * @param entities - An array of instances of classes that implement
 * {@link Stateful} whose states will be subscribed to and passed into the
 * `transformFn`.
 *
 * @param transformFn - A function that takes in the states of the entities
 * passed to this hook and produces a value.
 *
 * @returns A React state variable whose value is the result of calling the
 * `transformFn` with the states of the provided entities.
 */
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
