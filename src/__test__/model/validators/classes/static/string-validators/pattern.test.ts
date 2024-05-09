import { describe, test, expect } from 'vitest';
import { StringValidators, Validity } from '../../../../../../model';

describe('StringValidators.pattern()', () => {
  test(`It returns a validator that returns an invalid result when the pattern 
  does not match the string.`, () => {
    expect(StringValidators.pattern(/[A-Z]/).validate('').validity).toBe(
      Validity.Invalid,
    );
  });

  test(`It returns a validator that returns a valid result when the pattern 
  matches the string.`, () => {
    expect(StringValidators.pattern(/[A-Z]/).validate('A').validity).toBe(
      Validity.Valid,
    );
  });

  test(`When opts.trimBeforeValidation is falsy, the value is not trimmed before
  the predicate evaluates the value.`, () => {
    expect(StringValidators.pattern(/\s/).validate(' ').validity).toBe(
      Validity.Valid,
    );
  });

  test(`When opts.trimBeforeValidation is true, the value is trimmed before the 
  predicate evaluates the value.`, () => {
    expect(
      StringValidators.pattern(/\s/, { trimBeforeValidation: true }).validate(
        ' ',
      ).validity,
    ).toBe(Validity.Invalid);
  });

  test(`When called opts.validMessage is provided, it returns a Validator that 
  returns a result containing that message when its validate() method returns a
  valid result.`, () => {
    const message = 'The provided value is valid';
    expect(
      StringValidators.pattern(/test/, { validMessage: message }).validate(
        'test',
      ).message,
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
      StringValidators.pattern(/[A-Z]/, { invalidMessage: message }).validate(
        '',
      ).message,
    ).toStrictEqual({
      text: message,
      validity: Validity.Invalid,
    });
  });
});
