import { describe, test, expect } from 'vitest';
import { Validator, Validity, type Predicate } from '../../../model';

describe('Validator', () => {
  const required: Predicate<string> = value => {
    return value.length > 0;
  };

  test('When validate() is called and the predicate returns true, it returns an object with a validity property of Validity.Valid.', () => {
    const validator = new Validator({ predicate: required });
    expect(validator.validate('test')).toStrictEqual({
      validity: Validity.Valid,
    });
  });

  test('When validate() is called and the predicate returns false, it returns an object with a validity property of Validity.Invalid.', () => {
    const validator = new Validator({ predicate: required });
    expect(validator.validate('')).toStrictEqual({
      validity: Validity.Invalid,
    });
  });

  test('When validate() is called and the predicate returns true, it returns an object with a message property whose text is the validMessage passed into the constructor and whose validity is Validity.Valid.', () => {
    const validMessage = 'Value is not an empty string.';
    const validator = new Validator({ predicate: required, validMessage });
    expect(validator.validate('test')).toStrictEqual({
      validity: Validity.Valid,
      message: {
        text: validMessage,
        validity: Validity.Valid,
      },
    });
  });

  test('When validate() is called and the predicate returns false, it returns an object with a message property whose text is the invalidMessage passed into the constructor and whose validity is Validity.Invalid.', () => {
    const invalidMessage = 'Value must not be an empty string.';
    const validator = new Validator({ predicate: required, invalidMessage });
    expect(validator.validate('')).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: invalidMessage,
        validity: Validity.Invalid,
      },
    });
  });
});
