import type { Nameable } from '../interfaces';

/**
 * Transforms an array of {@link NameableObject}s into an object whose
 * keys are the names of those objects and whose values are the objects
 * themselves.
 *
 * @typeParam T - An array which may contain {@link Nameable} entities.
 */
export type NameableObject<T extends readonly unknown[]> = {
  [X in T[number] as X extends Nameable<string> ? X['name'] : never]: X;
};
