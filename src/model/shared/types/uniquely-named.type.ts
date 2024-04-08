import type { Nameable } from '../interfaces';

/**
 * Omits the item at a specified index from an array type.
 * 
 * @typeParam T - The array to omit the item from.
 * @typeParam I - The index of the item to omit.
 */
export type OmitIndex<
  T extends ReadonlyArray<Nameable<string>>,
  I extends keyof T & (string | number),
> = {
  [K in keyof T]: K extends `${I}` | I ? never : T[K];
};

/**
 * Enforces the requirement that no {@link Nameable} objects an array may share
 * their `name` property with another object in the same array.
 * 
 * @typeParam T - An array of {@link Nameable} entities to evaluate.
 */
export type UniquelyNamed<T extends ReadonlyArray<Nameable<string>>> = {
  [K in keyof T]: T[K]['name'] extends OmitIndex<T, K>[number]['name'] ?
    never
  : T[K];
};
