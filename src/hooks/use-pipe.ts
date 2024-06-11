import { useState, useEffect } from 'react';
import type { Stateful } from '../model';

type TransformFn<T extends Stateful, V> = (state: T['state']) => V;

/**
 * Accepts an instance of a class that implements {@link Stateful} and a
 * `transformFn`. Calls the `transformFn` with the state of the provided entity
 * and returns the result as a React state variable. The value of this variable
 * is updated whenever the state of the entity changes.
 *
 * @param entity - An instance of a class that implements {@link Stateful} whose
 * state will be subscribed to and passed to the `transformFn`.
 *
 * @param transformFn -  A function that takes in the state of the provided
 * entity and produces a value.
 *
 * @returns A React state variable whose value is the result of calling the
 * `transformFn` with the state of the provided entity.
 */
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
