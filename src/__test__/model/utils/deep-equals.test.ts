import { describe, test, expect } from 'vitest';
import { deepEquals } from '../../../model';

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

  test('It returns false for two different objects.', () => {
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
});
