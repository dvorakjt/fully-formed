import type { IField } from '../interfaces';
import type { Excludable } from '../../shared';

export type IExcludableField<
  T extends string,
  U = unknown,
  V extends boolean = boolean,
> = IField<T, U, V> & Excludable;
