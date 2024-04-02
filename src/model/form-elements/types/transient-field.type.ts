import type { AbstractField } from '../classes';

export type TransientField<Name extends string, Value> = AbstractField<
  Name,
  Value,
  true
>;
