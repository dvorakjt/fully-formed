import { useState, useEffect } from 'react';
import type { Stateful } from '../model';

type TransformFn<T extends Stateful, V> = (state: T['state']) => V;

/**
 * Accepts an instance of a class that implements {@link Stateful} and a
 * `transformFn` and returns a React state variable whose value is the result of
 * calling the `transformFn` with the state of the provided entity. If the state
 * of the entity changes, the `transformFn` will be called with the new state
 * and the returned React state variable will be updated.
 *
 * @param entity - An instance of a class that implements {@link Stateful} whose
 * state will be subscribed to and passed to the `transformFn`.
 *
 * @param transformFn -  A function that takes in the state of the entity
 * passed to this hook and produces a value.
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
