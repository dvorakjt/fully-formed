import type { Nameable } from '../interfaces';

export type DisjointlyNamed<
  T extends readonly Nameable[],
  U extends readonly Nameable[],
> = {
  [I in keyof T]: T[I]['name'] extends U[number]['name'] ? never : T[I];
};
