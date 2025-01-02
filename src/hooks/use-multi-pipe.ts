import { useState, useEffect } from 'react';
import type { Stateful, ArrayOfStates } from '../model';

/**
 * A function provided to {@link useMultiPipe} which is called when the state of
 * any watched entities changes to produce a new value derived from their
 * states.
 */
type MultiEntityTransformFn<T extends readonly Stateful[], V> = (
  states: ArrayOfStates<T>,
) => V;

/**
 * Accepts an array of {@link Stateful} entities and a `transformFn`. Calls the
 * `transformFn` with the states of those entities and returns the result as a
 * React state variable. The value of this variable is updated whenever the
 * state of any of the entities changes.
 *
 * @param entities - An array of {@link Stateful} entities whose states will be
 * subscribed to and passed into the `transformFn`.
 *
 * @param transformFn - A function that takes in the states of the provided
 * entities and produces a value.
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
