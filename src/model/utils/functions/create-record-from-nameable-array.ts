import type { Nameable, RecordFromNameableArray } from '../../shared';

export function createRecordFromNameableArray<T extends readonly Nameable[]>(
  arr: T,
): RecordFromNameableArray<T> {
  return arr.reduce((obj: Record<string, unknown>, item: T[number]) => {
    obj[item.name] = item;
    return obj;
  }, {}) as RecordFromNameableArray<T>;
}
