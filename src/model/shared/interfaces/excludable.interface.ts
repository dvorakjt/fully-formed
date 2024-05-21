import type { Stateful } from './stateful.interface';

export type ExcludableState = {
  exclude: boolean;
};

export interface Excludable extends Stateful<ExcludableState> {}
