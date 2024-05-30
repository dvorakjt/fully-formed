import type { IField } from './i-field.interface';

export interface TransientField<T extends string, V>
  extends IField<T, V, true> {}
