import type { AbstractField } from '../classes';

export type NonTransientField<Name extends string, Value> = AbstractField<
  Name,
  Value,
  false
>;
