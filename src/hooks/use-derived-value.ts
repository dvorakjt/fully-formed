import { useState, useEffect } from 'react';
import type { AbstractDerivedValue } from '../model';

/**
 * Takes in an {@link AbstractDerivedValue} and returns a React state variable
 * containing the `value` property of the {@link AbstractDerivedValue}.
 *
 * @param derivedValue - An {@link AbstractDerivedValue} to which the hook will
 * subscribe.
 *
 * @returns The value of the {@link AbstractDerivedValue}.
 *
 * @remarks
 * The variable returned by this hook will be updated whenever the `value`
 * property of the {@link AbstractDerivedValue} changes.
 */
export function useDerivedValue<
  T extends AbstractDerivedValue<string, unknown>,
>(derivedValue: T): T['value'] {
  const [value, setValue] = useState<T['value']>(derivedValue.value);

  useEffect(() => {
    const subscription = derivedValue.subscribeToValue(v => {
      setValue(v);
    });
    return () => subscription.unsubscribe();
  }, []);

  return value;
}
