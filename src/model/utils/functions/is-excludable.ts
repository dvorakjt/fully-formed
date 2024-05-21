import type { Excludable, Stateful } from '../../shared';

export function isExcludable<T extends Stateful>(
  element: T,
): element is T & Excludable {
  return (
    typeof element.state === 'object' &&
    element.state !== null &&
    'exclude' in element.state &&
    typeof element.state.exclude === 'boolean'
  );
}
