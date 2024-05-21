import type { Nameable, Validated } from '../../shared';
import type { DefaultAdaptFn } from './default-adapt-fn.type';

export type DefaultAdapterConstructorParams<
  T extends Nameable & Validated<unknown>,
> = {
  source: T;
  adaptFn?: DefaultAdaptFn<T>;
};
