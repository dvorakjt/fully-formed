import type { Nameable, Validated } from '../../shared';

export interface GroupMember<T extends string = string, U = unknown>
  extends Nameable<T>,
    Validated<U> {}
