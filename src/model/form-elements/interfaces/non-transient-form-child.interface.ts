import type { FormChild } from '..';

export interface NonTransientFormChild<T extends string, V>
  extends FormChild<T, V, false> {}
