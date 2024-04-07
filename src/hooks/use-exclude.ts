import { useState, useLayoutEffect } from 'react';
import type { Excludable } from '../model';

export function useExclude<T extends Excludable>(excludableEntity: T): boolean {
  const [exclude, setExclude] = useState<boolean>(
    excludableEntity.state.exclude,
  );

  useLayoutEffect(() => {
    const subscription = excludableEntity.subscribeToState(state => {
      setExclude(state.exclude);
    });
    return () => subscription.unsubscribe();
  }, []);

  return exclude;
}
