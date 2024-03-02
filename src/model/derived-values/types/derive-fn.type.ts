import type { StatefulArrayStates } from '../../reducers';
import type { Stateful } from '../../shared';

export type DeriveFn<T extends ReadonlyArray<Stateful<unknown>>, V> = (
  sourceStates: StatefulArrayStates<T>,
) => V;
