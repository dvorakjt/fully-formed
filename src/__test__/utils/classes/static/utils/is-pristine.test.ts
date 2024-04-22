import { describe, test, expect } from 'vitest';
import { Utils } from '../../../../../utils';

describe('Utils.isPristine()', () => {
  test(`It returns false if the focused property of the state it receives is 
  true.`, () => {
    const isPristine = Utils.isPristine({
      focused: true,
      visited: false,
      modified: false,
    });
    expect(isPristine).toBe(false);
  });

  test(`It returns false if the visited property of the state it receives is 
  true.`, () => {
    const isPristine = Utils.isPristine({
      visited: true,
      focused: false,
      modified: false,
    });
    expect(isPristine).toBe(false);
  });

  test(`It returns false if the modified property of the state it receives is 
  true.`, () => {
    const isPristine = Utils.isPristine({
      modified: true,
      focused: false,
      visited: false,
    });
    expect(isPristine).toBe(false);
  });

  test(`It returns true if the focused, visited, and modified properties of the 
  state it receives are all false.`, () => {
    const isPristine = Utils.isPristine({
      focused: false,
      visited: false,
      modified: false,
    });
    expect(isPristine).toBe(true);
  });
});
