import { describe, test, expect } from 'vitest';
import { StringValidators, Validity } from '../../../../model';

describe('StringValidators.required()', () => {
  test(`It returns a Validator that returns a result object with a validity 
  property of Validity.Invalid when its validate() method is called with an 
  empty string.`, () => {
    expect(StringValidators.required().validate('').validity).toBe(
      Validity.Invalid,
    );
  });

  test(`When called with no arguments, it returns a Validator that returns a 
  result object with a validity property of Validity.Valid when its validate() 
  method is called with a string containing only whitespace characters.`, () => {
    expect(StringValidators.required().validate(' ').validity).toBe(
      Validity.Valid,
    );
  });

  test(`When called with an object whose trimBeforeValidation property is 
  undefined, it returns a Validator that returns a result object with a validity 
  property of Validity.Valid when its validate() method is called with a string 
  containing only whitespace characters.`, () => {
    expect(StringValidators.required({}).validate(' ').validity).toBe(
      Validity.Valid,
    );
  });

  test(`When called with an object whose trimBeforeValidation property is false, 
  it returns a Validator that returns a result object with a validity property 
  of Validity.Valid when its validate() method is called with a string 
  containing only whitespace characters.`, () => {
    expect(
      StringValidators.required({ trimBeforeValidation: false }).validate(' ')
        .validity,
    ).toBe(Validity.Valid);
  });

  test(`When called with an object whose trimBeforeValidation property is true, 
  it returns a Validator that returns a result object with a validity property 
  of Validity.Invalid when its validate() method is called with a string 
  containing only whitespace characters.`, () => {
    expect(
      StringValidators.required({ trimBeforeValidation: true }).validate(
        ' \n\t ',
      ).validity,
    ).toBe(Validity.Invalid);
  });

  test(`When called with an object containing a validMessage property, it 
  returns a Validator that returns a result containing that message when its 
  validate() method returns a valid result.`, () => {
    const message = 'The provided value is not an empty string.';
    expect(
      StringValidators.required({ validMessage: message }).validate('test')
        .message,
    ).toStrictEqual({
      text: message,
      validity: Validity.Valid,
    });
  });

  test(`When called with an object containing an invalidMessage property, it 
  returns a Validator that returns a result containing that message when its 
  validate() method returns an invalid result.`, () => {
    const message = 'The provided value is an empty string.';
    expect(
      StringValidators.required({ invalidMessage: message }).validate('')
        .message,
    ).toStrictEqual({
      text: message,
      validity: Validity.Invalid,
    });
  });
});
