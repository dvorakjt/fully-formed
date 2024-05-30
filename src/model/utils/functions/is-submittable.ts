import type { Submittable } from '../../form-elements';

export function isSubmittable<T>(element: T): element is T & Submittable {
  return (
    typeof element === 'object' &&
    element !== null &&
    'state' in element &&
    typeof element.state === 'object' &&
    element.state !== null &&
    'submitted' in element.state &&
    typeof element.state.submitted === 'boolean' &&
    'setSubmitted' in element &&
    typeof element.setSubmitted === 'function'
  );
}
