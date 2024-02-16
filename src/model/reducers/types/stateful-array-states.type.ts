import type { Stateful } from '../../shared';

export type StatefulArrayStates<T extends ReadonlyArray<Stateful<unknown>>> = {
  [K in keyof T]: T[K]['state'];
};
