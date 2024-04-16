import { describe, test, expect } from 'vitest';
import { ObjectIdMap } from '../../../test-utils';

describe('ObjectIdMap', () => {
  test(`It returns an id when get() is called.`, () => {
    const objectIdMap = new ObjectIdMap();
    const obj = {};
    expect(objectIdMap.get(obj)).toBe(0);
  });

  test(`It returns a new id each time get() is called with a new object.`, () => {
    const objectIdMap = new ObjectIdMap();
    for (let i = 0; i < 100; i++) {
      const obj = {};
      expect(objectIdMap.get(obj)).toBe(i);
    }
  });

  test(`It returns the same id for an object previously added to the map.`, () => {
    const objectIdMap = new ObjectIdMap();
    const obj = {};
    expect(objectIdMap.get(obj)).toBe(0);

    const alsoAReferenceToObj = obj;
    expect(objectIdMap.get(alsoAReferenceToObj)).toBe(0);
  });
});
