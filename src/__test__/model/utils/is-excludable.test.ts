import { describe, test, expect } from 'vitest';
import { isExcludable } from '../../../model';

describe('isExcludable', () => {
  const nonObjects = [
    true,
    3.14,
    9007199254740991n,
    'test',
    undefined,
    Symbol.for('symbol'),
    function func(): void {},
  ];

  test('It returns false if the value it receives is not an object.', () => {
    for (const nonObject of nonObjects) {
      expect(isExcludable(nonObject)).toBe(false);
    }
  });

  test('It returns false if the value it receives is null.', () => {
    expect(isExcludable(null)).toBe(false);
  });

  test(`It returns false if the value it receives is an object that lacks a 
  property named "state."`, () => {
    expect(isExcludable({})).toBe(false);
  });

  test(`It returns false if the state property of the value it receives is not 
  an object.`, () => {
    for (const nonObject of nonObjects) {
      expect(
        isExcludable({
          state: nonObject,
        }),
      ).toBe(false);
    }
  });

  test(`It returns false if the state property of the value it receives is 
  null.`, () => {
    expect(isExcludable({ state: null })).toBe(false);
  });

  test(`It returns false if the state property of the value it receives is 
  an object that lacks a property named "exclude."`, () => {
    expect(isExcludable({ state: {} })).toBe(false);
  });

  test(`It returns false if the state property of the value it receives is an 
  object that has a property named "exclude," but that property is not a 
  boolean.`, () => {
    const nonBooleans = [
      3.14,
      9007199254740991n,
      'test',
      undefined,
      null,
      Symbol.for('symbol'),
      function func(): void {},
      {},
      [],
    ];

    for (const nonBoolean of nonBooleans) {
      expect(
        isExcludable({
          state: {
            exclude: nonBoolean,
          },
        }),
      ).toBe(false);
    }
  });

  test(`It returns true if the value it receives is an object with a property 
  named "state," which is itself an object with a property of type boolean named 
  "exclude."`, () => {
    expect(isExcludable({ state: { exclude: true } })).toBe(true);
    expect(isExcludable({ state: { exclude: false } })).toBe(true);
  });
});
