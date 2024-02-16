import type { Nameable } from '../interfaces';

export type DisjointlyNamed<
  T extends ReadonlyArray<Nameable<string>>,
  Other extends ReadonlyArray<Nameable<string>>,
> = {
  [I in keyof T]: T[I]['name'] extends Other[number]['name'] ? never : T[I];
};
