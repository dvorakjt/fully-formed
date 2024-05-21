import type { Nameable, Validated, ValidatedState } from '../../shared';
import type { PossiblyTransient } from './possibly-transient.interface';

export type FormChildState<T> = ValidatedState<T>;

export interface FormChild<
  T extends string = string,
  U = unknown,
  V extends boolean = boolean,
> extends Nameable<T>,
    Validated<U>,
    PossiblyTransient<V> {}
