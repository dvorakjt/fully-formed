import type { Nameable } from '../interfaces';

/**
 * Enforces the requirement that no {@link Nameable} objects within one array
 * may share a `name` with any {@link Nameable} object in a second array.
 * 
 * @typeParam T - An array of {@link Nameable} entities.
 * @typeParam Other - A second array of {@link Nameable} entities to compare to 
 * the first.
 */
export type DisjointlyNamed<
  T extends ReadonlyArray<Nameable<string>>,
  Other extends ReadonlyArray<Nameable<string>>,
> = {
  [I in keyof T]: T[I]['name'] extends Other[number]['name'] ? never : T[I];
};
