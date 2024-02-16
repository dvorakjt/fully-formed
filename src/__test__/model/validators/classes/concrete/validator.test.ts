import { describe, test, expect } from 'vitest';
import { Validator, Validity } from '../../../../../model';

describe('Validator', () => {
  const required = (value: string): boolean => {
    return value.length > 0;
  };

  test('When validate() is called, the value passed into the method is returned as a member of the result object.', () => {
    const validator = new Validator({ predicate: required });
    const value = 'test';
    expect(validator.validate(value).value).toBe(value);
  });

  test('When validate() is called and the predicate returns true, it returns an object with a validity property of Validity.Valid.', () => {
    const validator = new Validator({ predicate: required });
    const value = 'test';
    expect(validator.validate(value)).toStrictEqual({
      value,
      validity: Validity.Valid,
    });
  });

  test('When validate() is called and the predicate returns false, it returns an object with a validity property of Validity.Invalid.', () => {
    const validator = new Validator({ predicate: required });
    const value = '';
    expect(validator.validate(value)).toStrictEqual({
      value,
      validity: Validity.Invalid,
    });
  });

  test('When validate() is called and the predicate returns true, it returns an object with a message property whose text is the validMessage passed into its constructor and whose validity is Validity.Valid.', () => {
    const validMessage = 'Value is not an empty string.';
    const validator = new Validator({ predicate: required, validMessage });
    const value = 'test';
    expect(validator.validate(value)).toStrictEqual({
      value,
      validity: Validity.Valid,
      message: {
        text: validMessage,
        validity: Validity.Valid,
      },
    });
  });

  test('When validate() is called and the predicate returns false, it returns an object with a message property whose text is the invalidMessage passed into its constructor and whose validity is Validity.Invalid.', () => {
    const invalidMessage = 'Value must not be an empty string.';
    const validator = new Validator({ predicate: required, invalidMessage });
    const value = '';
    expect(validator.validate(value)).toStrictEqual({
      value,
      validity: Validity.Invalid,
      message: {
        text: invalidMessage,
        validity: Validity.Invalid,
      },
    });
  });
});
