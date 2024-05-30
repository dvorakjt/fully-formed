import { describe, test, expect } from 'vitest';
import { deepEquals } from '../../../../model';

describe('deepEquals()', () => {
  test('It returns true if two primitives are equal.', () => {
    const primitives = [
      'test',
      1,
      123456789n,
      false,
      undefined,
      Symbol.for('test'),
    ];

    primitives.forEach(primitive => {
      expect(deepEquals(primitive, primitive)).toBe(true);
    });
  });

  test('It returns true for two identical objects.', () => {
    const objectA = {
      fieldA: 'test',
      fieldB: 'test',
    };
    const objectB = {
      fieldB: 'test',
      fieldA: 'test',
    };

    expect(deepEquals(objectA, objectB)).toBe(true);
  });

  test('It returns false for objects whose properties have different values.', () => {
    const objectA = {
      password: 'password',
      confirmPassword: 'wrong password',
    };

    const objectB = {
      password: 'password',
      confirmPassword: 'password',
    };

    expect(deepEquals(objectA, objectB)).toBe(false);
  });

  test('It returns false for objects with a different number of properties.', () => {
    const objectA = {
      prop1: 1,
    };

    const objectB = {
      prop1: 1,
      prop2: 2,
    };

    expect(deepEquals(objectA, objectB)).toBe(false);
  });

  test('It returns false for objects whose properties have different names.', () => {
    const objectA = {
      prop1: 'test',
    };

    const objectB = {
      propA: 'test',
    };

    expect(deepEquals(objectA, objectB)).toBe(false);
  });

  test('It returns true for identical deeply nested structures.', () => {
    const objectA = {
      object: {
        nestedArrayOfObjects: [
          {
            nestedRegex: /\w+@\w+\.\w\w+/,
          },
          {
            nestedDate: new Date('1938-01-16'),
          },
        ],
        nestedObject: {
          deeplyNestedObject: {
            deeplyNestedPrimitive: 34,
          },
        },
      },
    };

    const objectB = {
      object: {
        nestedArrayOfObjects: [
          {
            nestedRegex: new RegExp('\\w+@\\w+\\.\\w\\w+'),
          },
          {
            nestedDate: new Date('1938-01-16'),
          },
        ],
        nestedObject: {
          deeplyNestedObject: {
            deeplyNestedPrimitive: 34,
          },
        },
      },
    };

    expect(deepEquals(objectA, objectB)).toBe(true);
  });

  test(`It returns false for object with a deeply nested property that 
  differs.`, () => {
    const objectA = {
      object: {
        nestedArrayOfObjects: [
          {
            nestedRegex: /\w+@\w+\.\w\w+/,
          },
          {
            nestedDate: new Date('1938-01-16'),
          },
        ],
        nestedObject: {
          deeplyNestedObject: {
            deeplyNestedPrimitive: 34,
          },
        },
      },
    };

    const objectB = {
      object: {
        nestedArrayOfObjects: [
          {
            nestedRegex: new RegExp('\\w+@\\w+\\.\\w\\w+'),
          },
          {
            nestedDate: new Date('1938-01-16'),
          },
        ],
        nestedObject: {
          deeplyNestedObject: {
            deeplyNestedPrimitive: 99,
          },
        },
      },
    };

    expect(deepEquals(objectA, objectB)).toBe(false);
  });

  test('It returns true for the same date.', () => {
    const dateA = new Date('1938-01-16');
    const dateB = new Date('1938-01-16');
    expect(deepEquals(dateA, dateB)).toBe(true);
  });

  test('It returns false for different dates.', () => {
    const dateA = new Date('1938-01-16');
    const dateB = new Date('1909-05-30');
    expect(deepEquals(dateA, dateB)).toBe(false);
  });

  test('It returns true for the same regular expression.', () => {
    const patternA = new RegExp('\\d{5}', 'g');
    const patternB = /\d{5}/g;
    expect(deepEquals(patternA, patternB)).toBe(true);
  });

  test('It returns false for different regular expressions.', () => {
    const patternA = new RegExp('\\d{5}');
    const patternB = /\d{5}/gi;
    expect(deepEquals(patternA, patternB)).toBe(false);
  });

  test('It returns true if two functions are exactly the same.', () => {
    const funcA = function (x: number, y: number): number {
      return x + y;
    };

    const funcB = function (x: number, y: number): number {
      return x + y;
    };

    expect(deepEquals(funcA, funcB)).toBe(true);
  });

  test('It returns false if it receives two different functions.', () => {
    const funcA = function (x: number, y: number): number {
      return x + y;
    };

    const funcB = function (x: number, y: number): number {
      return x * y;
    };

    expect(deepEquals(funcA, funcB)).toBe(false);
  });
});
