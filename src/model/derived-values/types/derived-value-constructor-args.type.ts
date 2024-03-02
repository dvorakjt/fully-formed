import type { DeriveFn } from './derive-fn.type';
import type { Stateful } from '../../shared';

export type DerivedValueConstructorArgs<
  Name extends string,
  Sources extends ReadonlyArray<Stateful<unknown>>,
  V,
> = {
  name: Name;
  sources: Sources;
  deriveFn: DeriveFn<Sources, V>;
};
