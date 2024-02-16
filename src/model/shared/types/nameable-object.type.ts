import type { Nameable } from '../interfaces';

export type NameableObject<T extends readonly unknown[]> = {
  [X in T[number] as X extends Nameable<string> ? X['name'] : never]: X;
};
