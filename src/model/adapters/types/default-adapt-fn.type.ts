import type { Validated, ValueOf } from '../../shared';

export type DefaultAdaptFn<T extends Validated<unknown>> = (
  sourceValue: ValueOf<T>,
) => ValueOf<T>;
