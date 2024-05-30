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
 * through means that do not trigger the blur event, for instance,
 * navigating to another page with back/forward. This ensures that for forms
 * that perist in memory even when the page changes (for instance, multi-page
 * forms), the `isInFocus` property of their fields' states continues to behave
 * as expected.
 */
export function useCancelFocusOnUnmount(entity: Focusable): void {
  useEffect(() => {
    return (): void => entity.cancelFocus();
  }, []);
}
