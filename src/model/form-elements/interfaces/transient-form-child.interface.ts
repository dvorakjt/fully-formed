import type { FormChild } from '..';

export interface TransientFormChild<T extends string, V>
  extends FormChild<T, V, true> {}
