import { describe, test, expect } from 'vitest';
import { Field, NameableObjectFactory } from '../../../../../model';

describe('NameableObjectFactory', () => {
  test('It returns an object whose keys are the names of the items of the provided array and whose values are those items.', () => {
    const formElements = [
      new Field({ name: 'firstName', defaultValue: '' }),
      new Field({ name: 'lastName', defaultValue: '' }),
    ];
    const obj =
      NameableObjectFactory.createNameableObjectFromArray(formElements);
    expect(obj.firstName).toBe(formElements[0]);
    expect(obj.lastName).toBe(formElements[1]);
  });

  test('It returns an empty object when it receives an empty array.', () => {
    expect(
      NameableObjectFactory.createNameableObjectFromArray([]),
    ).toStrictEqual({});
  });
});
