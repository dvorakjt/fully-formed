import type { Validity } from '../enums';
import type { Stateful } from './stateful.interface';

export type ValidatedState<T = unknown> = {
  value: T;
  validity: Validity;
};

export type Validated<T = unknown> = Stateful<ValidatedState<T>>;
