import type { Exclude } from './exclude.type';

export type ExcludableState<Excludable extends boolean> = {
  exclude: Exclude<Excludable>;
};
