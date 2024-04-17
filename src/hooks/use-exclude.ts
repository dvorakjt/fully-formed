import { useState, useEffect } from 'react';
import type { Excludable } from '../model';

/**
 * Takes in an instance of a class implementing the {@link Excludable} interface
 * and returns a React state variable of type `boolean` indicating whether or
 * not the class it received is currently excluded.
 *
 * @param excludableEntity - An instance of a class that implements
 * {@link Excludable} to which the hook will subscribe.
 *
 * @returns A React state variable of type `boolean` indicating whether or not
 * the `excludableEntity` is currently excluded.
 *
 * @remarks
 * The variable returned by this hook will be updated whenever the `exclude`
 * property of the `state` of the `excludableEntity` changes.
 */
export function useExclude<T extends Excludable>(excludableEntity: T): boolean {
  const [exclude, setExclude] = useState<boolean>(
    excludableEntity.state.exclude,
  );

  useEffect(() => {
    const subscription = excludableEntity.subscribeToState(state => {
      setExclude(state.exclude);
    });
    return () => subscription.unsubscribe();
  }, []);

  return exclude;
}
