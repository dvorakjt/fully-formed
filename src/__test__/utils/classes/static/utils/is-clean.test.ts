import { describe, test, expect } from 'vitest';
import { Utils } from '../../../../../utils';

describe('Utils.isClean()', () => {
  test(`It returns false if the visited property of the state it receives is 
  true.`, () => {
    const isClean = Utils.isClean({
      visited: true,
      modified: false,
      focused: false,
    });
    expect(isClean).toBe(false);
  });

  test(`It returns false if the modified property of the state it receives is 
  true.`, () => {
    const isClean = Utils.isClean({
      modified: true,
      visited: false,
      focused: false,
    });
    expect(isClean).toBe(false);
  });

  test(`It returns true if the visited, focused, and modified properties of the 
  state it receives are all false.`, () => {
    const isClean = Utils.isClean({
      modified: false,
      visited: false,
      focused: false,
    });
    expect(isClean).toBe(true);
  });

  test(`It returns true if the visited and modified properties of the state it 
  receives are false and the focused property is true.`, () => {
    const isClean = Utils.isClean({
      modified: false,
      visited: false,
      focused: true,
    });
    expect(isClean).toBe(true);
  });
});
