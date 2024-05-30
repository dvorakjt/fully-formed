import type { Nameable } from '../interfaces';

export type OmitIndex<
  T extends readonly Nameable[],
  I extends keyof T & (string | number),
> = {
  [K in keyof T]: K extends `${I}` | I ? never : T[K];
};

export type UniquelyNamed<T extends readonly Nameable[]> = {
  [K in keyof T]: T[K]['name'] extends OmitIndex<T, K>[number]['name'] ? never
  : T[K];
};
