import { useEffect } from 'react';
import type { Focusable } from '../model';

/**
 * Calls the `cancelFocus()` method of a {@link Focusable} entity when the
 * React component that has called this hook unmounts.
 *
 * @param entity - The {@link Focusable} element whose `cancelFocus()` method
 * should be invoked.
 *
 * @remarks
 * Ensures that `cancelFocus()` is called when an input, etc. loses focus
 * through means that do not trigger the blur event (for instance,
 * using the keyboard to navigate backwards or forwards).
 */
export function useCancelFocusOnUnmount(entity: Focusable): void {
  useEffect(() => {
    return (): void => entity.cancelFocus();
  }, []);
}
