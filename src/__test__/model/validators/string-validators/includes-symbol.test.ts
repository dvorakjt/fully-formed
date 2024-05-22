import { describe, test, expect } from 'vitest';
import { StringValidators, Validity } from '../../../../model';

describe('StringValidators.includesSymbol()', () => {
  test('It returns a validator that determines whether a string contains a symbol, and, if so, returns a valid result.', () => {
    const symbols = '!"#$%&\'()*+,-./\\:;<=>?@[]^_`{|}~';
    const includesSymbol = StringValidators.includesSymbol();
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      expect(includesSymbol.validate(`${symbol}`).validity).toBe(
        Validity.Valid,
      );
      expect(includesSymbol.validate(`abcdef${symbol}`).validity).toBe(
        Validity.Valid,
      );
      expect(includesSymbol.validate(`${symbol}abcdef`).validity).toBe(
        Validity.Valid,
      );
      expect(includesSymbol.validate(`abc${symbol}def`).validity).toBe(
        Validity.Valid,
      );
    }
  });
  test('It returns a validator that determines whether a string contains a symbol, and, if not, returns an invalid result. ', () => {
    const includesSymbol = StringValidators.includesSymbol();
    expect(includesSymbol.validate('').validity).toBe(Validity.Invalid);
    expect(includesSymbol.validate('abcdefABCDEF012345').validity).toBe(
      Validity.Invalid,
    );
  });

  test('If a valid message was provided, that message is returned as part of a valid result.', () => {
    const validMessage = 'The provided string contains a symbol.';
    const includesSymbol = StringValidators.includesSymbol({ validMessage });
    expect(includesSymbol.validate('!').message).toStrictEqual({
      text: validMessage,
      validity: Validity.Valid,
    });
  });

  test('If an invalid message was provided, that message is returned as part of an invalid result.', () => {
    const invalidMessage = 'The provided value must contain a symbol.';
    const includesSymbol = StringValidators.includesSymbol({ invalidMessage });
    expect(includesSymbol.validate('').message).toStrictEqual({
      text: invalidMessage,
      validity: Validity.Invalid,
    });
  });
});
