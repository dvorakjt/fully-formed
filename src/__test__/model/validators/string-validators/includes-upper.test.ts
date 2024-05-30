import { describe, test, expect } from 'vitest';
import { StringValidators, Validity } from '../../../../model';

describe('StringValidators.includesUpper()', () => {
  test(`It returns a validator that determines whether a string contains an 
  uppercase letter, and if so, returns a valid result.`, () => {
    const includesUpper = StringValidators.includesUpper();
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode('A'.charCodeAt(0) + i);
      expect(includesUpper.validate(char).validity).toBe(Validity.Valid);
      expect(includesUpper.validate(`abcdef12345!@#${char}`).validity).toBe(
        Validity.Valid,
      );
      expect(includesUpper.validate(`${char}abcdef12345!@#`).validity).toBe(
        Validity.Valid,
      );
      expect(includesUpper.validate(`abc123!${char}def456@#`).validity).toBe(
        Validity.Valid,
      );
    }
  });

  test(`It returns a validator that determines whether a string contains an 
  uppercase letter, and if not, returns an invalid result.`, () => {
    const includesUpper = StringValidators.includesUpper();
    expect(
      includesUpper.validate(
        'abcdefghijklmnopqrstuvwxyz123456789!@#$%^&*()_+ \n\t',
      ).validity,
    ).toBe(Validity.Invalid);
  });

  test(`If a valid message was provided, that message is returned as part of the 
  result when the result is valid.`, () => {
    const validMessage = 'The provided value contains an uppercase character.';
    const includesUpper = StringValidators.includesUpper({ validMessage });
    expect(includesUpper.validate('A').message).toStrictEqual({
      text: validMessage,
      validity: Validity.Valid,
    });
  });

  test(`If an invalid message was provided, that message is returned as part of 
  the result when the result is invalid.`, () => {
    const invalidMessage =
      'The provided value does not contain an uppercase character.';
    const includesUpper = StringValidators.includesUpper({ invalidMessage });
    expect(includesUpper.validate('').message).toStrictEqual({
      text: invalidMessage,
      validity: Validity.Invalid,
    });
  });
});
