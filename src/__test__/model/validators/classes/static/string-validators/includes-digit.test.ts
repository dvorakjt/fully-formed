import { describe, test, expect } from 'vitest';
import { StringValidators, Validity } from '../../../../../../model';

describe('StringValidators.includesDigit()', () => {
  test('It returns a validator that determines whether a string contains a digit, and, if so, returns a valid result.', () => {
    const includesDigit = StringValidators.includesDigit();
    for (let i = 0; i <= 9; i++) {
      expect(includesDigit.validate(`${i}`).validity).toBe(Validity.Valid);
      expect(includesDigit.validate(`abcdef${i}`).validity).toBe(
        Validity.Valid,
      );
      expect(includesDigit.validate(`${i}abcdef`).validity).toBe(
        Validity.Valid,
      );
      expect(includesDigit.validate(`abc${i}def`).validity).toBe(
        Validity.Valid,
      );
    }
  });

  test('It returns a validator that determines whether a string contains a digit, and, if not, returns an invalid result. ', () => {
    const includesDigit = StringValidators.includesDigit();
    expect(includesDigit.validate('').validity).toBe(Validity.Invalid);
    expect(
      includesDigit.validate('abcdefABCDEF!@#$%%^&*()-_=+ ').validity,
    ).toBe(Validity.Invalid);
  });

  test('If a valid message was provided, that message is returned as part of a valid result.', () => {
    const validMessage = 'The provided string includes a digit.';
    const includesDigit = StringValidators.includesDigit({ validMessage });
    expect(includesDigit.validate('1').message).toStrictEqual({
      text: validMessage,
      validity: Validity.Valid,
    });
  });

  test('If an invalid message was provided, that message is returned as part of an invalid result.', () => {
    const invalidMessage = 'The provided string must include a digit.';
    const includesDigit = StringValidators.includesDigit({ invalidMessage });
    expect(includesDigit.validate('').message).toStrictEqual({
      text: invalidMessage,
      validity: Validity.Invalid,
    });
  });
});
