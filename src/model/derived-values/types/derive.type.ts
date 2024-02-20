import type { StatefulArrayStates } from '../../reducers';
import type { Stateful } from '../../shared';

export type Derive<
  T extends ReadonlyArray<
    Stateful<unknown>
  >,
  V,
> = (sourceStates: StatefulArrayStates<T>) => V;
