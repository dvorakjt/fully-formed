import type { Nameable, Validated, ValidatedState } from '../../shared';

export type FormChildState<T> = ValidatedState<T>;

export interface FormChild<T extends string = string, U = unknown>
  extends Nameable<T>,
    Validated<U> {}
