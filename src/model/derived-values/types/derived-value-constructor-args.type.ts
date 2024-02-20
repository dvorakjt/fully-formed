import type { Derive } from './derive.type';
import type { Stateful } from '../../shared';

export type DerivedValueConstructorArgs<
  Name extends string,
  Sources extends ReadonlyArray<
    Stateful<unknown>
  >,
  V,
> = {
  name: Name;
  sources: Sources;
  derive: Derive<Sources, V>;
};
