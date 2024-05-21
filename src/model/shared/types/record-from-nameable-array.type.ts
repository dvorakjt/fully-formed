import type { Nameable } from '../interfaces';

export type RecordFromNameableArray<T extends readonly Nameable[]> = {
  [X in T[number] as X extends Nameable<string> ? X['name'] : never]: X;
};
