import { describe, test, expect, vi } from 'vitest';
import { isResettable } from '../../../../model';

describe('isResettable()', () => {
  test('It returns false if the value it receives is not an object.', () => {
    const nonObjects = [
      true,
      3.14,
      9007199254740991n,
      'test',
      undefined,
      Symbol.for('symbol'),
      function func(): void {},
    ];

    for (const nonObject of nonObjects) {
      expect(isResettable(nonObject)).toBe(false);
    }
  });

  test('It returns false if the value it receives is null.', () => {
    expect(isResettable(null)).toBe(false);
  });

  test(`It returns false if the value it receives is an object that lacks a 
  property called "reset."`, () => {
    expect(isResettable({})).toBe(false);
  });

  test(`It returns false if the value it receives is an array.`, () => {
    expect(isResettable([])).toBe(false);
  });

  test(`It returns false if the value if receives is an object that has a 
  property called "reset," but that property is not a function.`, () => {
    const nonFunctions = [
      true,
      3.14,
      9007199254740991n,
      'test',
      undefined,
      null,
      {},
      [],
      Symbol.for('symbol'),
    ];

    for (const nonFunction of nonFunctions) {
      expect(
        isResettable({
          reset: nonFunction,
        }),
      ).toBe(false);
    }
  });

  test(`It returns true if the value it receives is an object with a method 
  called "reset."`, () => {
    expect(isResettable({ reset: vi.fn() })).toBe(true);
  });
});
