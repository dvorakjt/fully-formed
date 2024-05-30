import type { Nameable, Validated } from '../../shared';

export interface IAdapter<T extends string = string, U = unknown>
  extends Nameable<T>,
    Validated<U> {}
