import type { Resettable } from '../../form-elements';

export function isResettable<T>(element: T): element is T & Resettable {
  return (
    typeof element === 'object' &&
    element !== null &&
    'reset' in element &&
    typeof element.reset === 'function'
  );
}
