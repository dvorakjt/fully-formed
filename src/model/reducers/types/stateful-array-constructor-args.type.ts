import type { Stateful } from '../../shared';

export type StatefulArrayConstructorArgs<
  T extends ReadonlyArray<Stateful<unknown>>,
> = {
  members: T;
};
