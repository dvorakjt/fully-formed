import type { StatefulArrayStates } from '../../reducers';
import type { Stateful } from '../../shared';

/**
 * Produces a value from an array of form element and/or group states.
 */
export type DeriveFn<T extends ReadonlyArray<Stateful<unknown>>, V> = (
  sourceStates: StatefulArrayStates<T>,
) => V;
