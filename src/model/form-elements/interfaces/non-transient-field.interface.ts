import type { IField } from './i-field.interface';

export interface NonTransientField<T extends string, V>
  extends IField<T, V, false> {}
