import { describe, test, expect } from 'vitest';
import { createRecordFromNameableArray } from '../../../model';

describe('createRecordFromNameableArray()', () => {
  test(`It returns an object whose keys are the names of the items of the 
  array it received, and whose values are those items.`, () => {
    const arr = [
      {
        name: 'item0',
      },
      {
        name: 'item1',
      },
      {
        name: 'item2',
      },
    ] as const;

    const record = createRecordFromNameableArray(arr);

    expect(record.item0).toBe(arr[0]);
    expect(record.item1).toBe(arr[1]);
    expect(record.item2).toBe(arr[2]);
  });
});
