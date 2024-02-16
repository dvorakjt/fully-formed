import type { Nameable } from '../interfaces';

type ExcludeIndex<
  T extends ReadonlyArray<Nameable<string>>,
  I extends keyof T & (string | number),
> = {
  [K in keyof T]: K extends `${I}` | I ? never : T[K];
};

export type UniquelyNamed<T extends ReadonlyArray<Nameable<string>>> = {
  [K in keyof T]: T[K]['name'] extends ExcludeIndex<T, K>[number]['name'] ?
    never
  : T[K];
};
