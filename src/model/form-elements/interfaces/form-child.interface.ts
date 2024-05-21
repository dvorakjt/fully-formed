import type { Merged, Nameable, Validated, ValidatedState } from '../../shared';
import type { PossiblyTransient } from './possibly-transient.interface';
import type { Submittable, SubmittableState } from './submittable.interface';

export type FormChildState<T> = ValidatedState<T> & SubmittableState;

export interface FormChild<
  T extends string = string,
  U = unknown,
  V extends boolean = boolean,
> extends Merged<
    Nameable<T> & Validated<U> & PossiblyTransient<V> & Submittable
  > {}
