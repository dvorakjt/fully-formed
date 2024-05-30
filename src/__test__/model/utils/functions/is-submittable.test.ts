import { describe, test, expect, vi } from 'vitest';
import { isSubmittable } from '../../../../model';

describe('isSubmittable', () => {
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
      expect(isSubmittable(nonObject)).toBe(false);
    }
  });

  test('It returns false if the value it receives is null.', () => {
    expect(isSubmittable(null)).toBe(false);
  });

  test(`It returns false if the value it receives is an object that lacks a 
  property named "state."`, () => {
    expect(isSubmittable({ setSubmitted: vi.fn() })).toBe(false);
  });

  test(`It returns false if the value it receives is an object that lacks a 
  property named "setSubmitted."`, () => {
    expect(isSubmittable({ state: { submitted: true } })).toBe(false);
  });

  test(`It returns false if the state property of the value it receives is not 
  an object.`, () => {
    for (const nonObject of nonObjects) {
      expect(
        isSubmittable({
          state: nonObject,
          setSubmitted: vi.fn(),
        }),
      ).toBe(false);
    }
  });

  test(`It returns false if the state property of the value it receives is 
  null.`, () => {
    expect(isSubmittable({ state: null, setSubmitted: vi.fn() })).toBe(false);
  });

  test(`It returns false if the state property of the value it receives is 
  an object that lacks a property named "submitted."`, () => {
    expect(isSubmittable({ state: {}, setSubmitted: vi.fn() })).toBe(false);
  });

  test(`It returns false if the state property of the value it receives is an 
  object that has a property named "submitted," but that property is not a 
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
        isSubmittable({
          state: {
            submitted: nonBoolean,
          },
          setSubmitted: vi.fn(),
        }),
      ).toBe(false);
    }
  });

  test(`It returns false when the value it receives is an object with a 
  property named "setSubmitted," but that property is not a function.`, () => {
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
        isSubmittable({
          state: {
            submitted: true,
          },
          setSubmitted: nonFunction,
        }),
      ).toBe(false);
    }
  });

  test(`It returns true if the value it receives is an object with properties 
  "state" and "setSubmitted", "setSubmitted" is a function, and "state" is an 
  object with a property named "submitted," which is a boolean.`, () => {
    expect(
      isSubmittable({
        state: {
          submitted: true,
        },
        setSubmitted: vi.fn(),
      }),
    ).toBe(true);

    expect(
      isSubmittable({
        state: {
          submitted: false,
        },
        setSubmitted: vi.fn(),
      }),
    ).toBe(true);
  });
});
