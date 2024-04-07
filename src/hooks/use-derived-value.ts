import { useState, useLayoutEffect } from 'react';
import type { AbstractDerivedValue } from '../model';

export function useDerivedValue<
  T extends AbstractDerivedValue<string, unknown>,
>(derivedValue: T): T['value'] {
  const [value, setValue] = useState<T['value']>(derivedValue.value);

  useLayoutEffect(() => {
    const subscription = derivedValue.subscribeToValue(v => {
      setValue(v);
    });
    return () => subscription.unsubscribe();
  }, []);

  return value;
}
