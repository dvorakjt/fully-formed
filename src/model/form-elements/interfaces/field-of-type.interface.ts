import type { IField } from './i-field.interface';

export interface FieldOfType<T> extends IField<string, T, boolean> {}
