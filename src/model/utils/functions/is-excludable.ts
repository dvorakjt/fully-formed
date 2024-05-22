import type { Excludable } from '../../shared';

export function isExcludable<T>(element: T): element is T & Excludable {
  return (
    typeof element === 'object' &&
    element !== null &&
    'state' in element &&
    typeof element.state === 'object' &&
    element.state !== null &&
    'exclude' in element.state &&
    typeof element.state.exclude === 'boolean'
  );
}
