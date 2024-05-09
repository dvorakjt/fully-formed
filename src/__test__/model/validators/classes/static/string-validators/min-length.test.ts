import { describe, test, expect } from 'vitest';
import { StringValidators, Validity } from '../../../../../../model';

describe('StringValidators.minLength()', () => {
  test(`It returns a validator that returns an invalid result when the length of
  the string is less than the min length.`, () => {
    expect(StringValidators.minLength(1).validate('').validity).toBe(
      Validity.Invalid,
    );
  });

  test(`It returns a validator that returns a valid result when the length of 
  the string is equal to the min length.`, () => {
    expect(StringValidators.minLength(1).validate('A').validity).toBe(
      Validity.Valid,
    );
  });

  test(`It returns a validator that returns a valid result when the length of 
  the string is greater than the min length.`, () => {
    expect(StringValidators.minLength(1).validate('AAA').validity).toBe(
      Validity.Valid,
    );
  });

  test(`When opts.trimBeforeValidation is falsy, the value is not trimmed before
  the predicate evaluates the value.`, () => {
    expect(StringValidators.minLength(1).validate(' ').validity).toBe(
      Validity.Valid,
    );
  });

  test(`When opts.trimBeforeValidation is true, the value is trimmed before the 
  predicate evaluates the value.`, () => {
    expect(
      StringValidators.minLength(1, { trimBeforeValidation: true }).validate(
        ' ',
      ).validity,
    ).toBe(Validity.Invalid);
  });

  test(`When called opts.validMessage is provided, it returns a Validator that 
  returns a result containing that message when its validate() method returns a
  valid result.`, () => {
    const message = 'The provided value is valid';
    expect(
      StringValidators.minLength(1, { validMessage: message }).validate('test')
        .message,
    ).toStrictEqual({
      text: message,
      validity: Validity.Valid,
    });
  });

  test(`When called opts.invalidMessage is provided, it returns a Validator that 
  returns a result containing that message when its validate() method returns an 
  invalid result.`, () => {
    const message = 'The provided value not valid.';
    expect(
      StringValidators.minLength(1, { invalidMessage: message }).validate('')
        .message,
    ).toStrictEqual({
      text: message,
      validity: Validity.Invalid,
    });
  });
});
