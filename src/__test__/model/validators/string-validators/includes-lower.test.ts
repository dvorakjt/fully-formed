import { describe, test, expect } from 'vitest';
import { StringValidators, Validity } from '../../../../model';

describe('StringValidators.includesLower()', () => {
  test('It returns a validator that determines whether a string contains a lowercase letter, and, if so, returns a valid result.', () => {
    const includesLower = StringValidators.includesLower();
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(includesLower.validate(char).validity).toBe(Validity.Valid);
      expect(includesLower.validate(`ABCDEF12345!@#${char}`).validity).toBe(
        Validity.Valid,
      );
      expect(includesLower.validate(`${char}ABDEF12345!@#`).validity).toBe(
        Validity.Valid,
      );
      expect(includesLower.validate(`ABC123!${char}DEF456@#`).validity).toBe(
        Validity.Valid,
      );
    }
  });

  test('It returns a validator that determines whether a string contains a lowercase letter, and, if not, returns an invalid result. ', () => {
    const includesLower = StringValidators.includesLower();
    expect(includesLower.validate('').validity).toBe(Validity.Invalid);
    expect(includesLower.validate('ABDEF12345!@#$%_ ').validity).toBe(
      Validity.Invalid,
    );
  });

  test('If a valid message was provided, that message is returned as part of a valid result.', () => {
    const validMessage = 'The provided string includes a lowercase letter.';
    const includesLower = StringValidators.includesLower({ validMessage });
    expect(includesLower.validate('a').message).toStrictEqual({
      text: validMessage,
      validity: Validity.Valid,
    });
  });

  test('If an invalid message was provided, that message is returned as part of an invalid result.', () => {
    const invalidMessage =
      'The provided string must include a lowercase letter.';
    const includesLower = StringValidators.includesLower({ invalidMessage });
    expect(includesLower.validate('').message).toStrictEqual({
      text: invalidMessage,
      validity: Validity.Invalid,
    });
  });
});
