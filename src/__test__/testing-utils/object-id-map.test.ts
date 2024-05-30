import { describe, test, expect } from 'vitest';
import { ObjectIdMap } from '../../test-utils';

describe('ObjectIdMap', () => {
  test(`When get() is called with an object not previously existent in the 
  map, it returns a new id.`, () => {
    const map = new ObjectIdMap();

    for (let i = 0; i < 10; i++) {
      const id = map.get({});
      expect(id).toBe(i);
    }
  });

  test(`When get() is called with an object already added to the map, it 
  returns the same id.`, () => {
    const map = new ObjectIdMap();
    const obj = {};

    for (let i = 0; i < 10; i++) {
      expect(map.get(obj)).toBe(0);
    }
  });
});
