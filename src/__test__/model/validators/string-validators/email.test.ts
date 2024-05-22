import { describe, test, expect } from 'vitest';
import { StringValidators, Validity } from '../../../../model';

const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseAlphabet = lowercaseAlphabet.toUpperCase();
const digits = '0123456789';
const validLocalPartSymbols = "!#$%&'*+-/=?^_`{|}~";

describe('StringValidators.email()', () => {
  test(`It returns a validator that returns Validity.Invalid when it receives 
  an empty string.`, () => {
    const validator = StringValidators.email();
    expect(validator.validate('').validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  simple email address.`, () => {
    const emailAddr = 'a@b.eu';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string address with only lowercase letters in the local part.`, () => {
    const emailAddr = `${lowercaseAlphabet}@example.com`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string address with only lowercase letters in the local part.`, () => {
    const emailAddr = `${uppercaseAlphabet}@example.com`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string address with only numbers in the local part.`, () => {
    const emailAddr = `${digits}@example.com`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string address with only special characters in the local part.`, () => {
    const emailAddr = `${validLocalPartSymbols}@example.com`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string that includes a dot in between other valid characters in the local part.`, () => {
    const emailAddr = 'a.b.1.2.!@example.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string that includes all uppercase characters in the domain.`, () => {
    const emailAddr = 'user@EXAMPLE.COM';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string that includes hyphens between alphanumeric characters in the domain.`, () => {
    const emailAddr = 'user@my-awesome-website.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string that includes multiple valid DNS labels.`, () => {
    const emailAddr = 'user@valid-subdomain.subdomain-2.my-awesome-website.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string without a local part.`, () => {
    const emailAddr = '@example.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Valid when it receives a 
  string whose local part is 64 characters long.`, () => {
    const localPart = 'a'.repeat(64);
    const emailAddr = `${localPart}@example.com`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string whose local part is 65 characters long.`, () => {
    const localPart = 'a'.repeat(65);
    const emailAddr = `${localPart}@example.com`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string whose local part begins with a "."`, () => {
    const emailAddr = '.user@example.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string whose local part ends with a "."`, () => {
    const emailAddr = 'user.@example.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string whose local part contains consecutive "."`, () => {
    const emailAddr = 'some..user@example.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string that does not contain an @ symbol.`, () => {
    const emailAddr = 'not.an.email-at-all';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string that contains more than one @ symbol.`, () => {
    const emailAddr = 'too@many@symbols.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string with invalid characters in the local part.`, () => {
    const validCharacters = [
      lowercaseAlphabet,
      uppercaseAlphabet,
      digits,
      validLocalPartSymbols,
      '.',
    ].join('');
    const validator = StringValidators.email();

    for (let i = 0; i <= 255; i++) {
      const char = String.fromCharCode(i);

      if (validCharacters.includes(char)) {
        continue;
      }

      const emailAddr = `${char}@example.com`;
      expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
    }
  });

  test(`It returns a validator that returns Validity.Valid when the domain is 
  255 characters long.`, () => {
    const dnsLabel = 'a'.repeat(62) + '.';
    const domain = dnsLabel.repeat(4) + 'com';
    expect(domain.length).toBe(255);

    const emailAddr = `user@${domain}`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Invalid when the domain is 
  256 characters long.`, () => {
    const dnsLabel = 'a'.repeat(62) + '.';
    const domain = dnsLabel.repeat(4) + 'site';
    expect(domain.length).toBe(256);

    const emailAddr = `user@${domain}`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Valid when one DNS label is 
  63 characters long.`, () => {
    const dnsLabel = 'a'.repeat(63);
    const emailAddr = `user@${dnsLabel}.com`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`It returns a validator that returns Validity.Invalid when one DNS label 
  is 64 characters long.`, () => {
    const dnsLabel = 'a'.repeat(64);
    const emailAddr = `user@${dnsLabel}.com`;
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when the domain 
  contains invalid characters.`, () => {
    const validCharacters = [
      lowercaseAlphabet,
      uppercaseAlphabet,
      '.',
      '-',
    ].join('');
    const validator = StringValidators.email();

    for (let i = 0; i <= 255; i++) {
      const char = String.fromCharCode(i);

      if (validCharacters.includes(char)) {
        continue;
      }

      const emailAddr = `user@${char}.com`;
      expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
    }
  });

  test(`It returns a validator that returns Validity.Invalid when the domain 
  contains consecutive hyphens.`, () => {
    const emailAddr = 'user@my--website.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when the domain 
  contains consecutive periods.`, () => {
    const emailAddr = 'user@my..website.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when a dns label 
  begins with a hyphen.`, () => {
    const emailAddr = 'user@-example.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a valdiator that returns Validity.Invalid when a dns label 
  ends with a hyphen.`, () => {
    const emailAddr = 'user@example-.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when the domain 
  begins with a period.`, () => {
    const emailAddr = 'user@.example.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when the top level 
  domain is missing.`, () => {
    const emailAddr = 'user@example';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when it receives a 
  string that ends with a period.`, () => {
    const emailAddr = 'user@example.com.';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when the top-level 
  domain is less than 2 characters long.`, () => {
    const emailAddr = 'user@example.c';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`It returns a validator that returns Validity.Invalid when the top-level 
  domain contains a non-alphabetical character.`, () => {
    const validCharacters = [lowercaseAlphabet, uppercaseAlphabet].join('');
    const validator = StringValidators.email();

    for (let i = 0; i <= 255; i++) {
      const char = String.fromCharCode(i);

      if (validCharacters.includes(char)) {
        continue;
      }

      const emailAddr = `user@example.co${char}`;
      expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
    }
  });

  test(`When trimBeforeValidation is omitted, the provided string is not trimmed 
  before validation.`, () => {
    const emailAddr = ' user@example.com';
    const validator = StringValidators.email();
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`When trimBeforeValidation is false, the provided string is not trimmed 
  before validation.`, () => {
    const emailAddr = ' user@example.com';
    const validator = StringValidators.email({ trimBeforeValidation: false });
    expect(validator.validate(emailAddr).validity).toBe(Validity.Invalid);
  });

  test(`When trimBeforeValidation is true, the provided string is trimmed before 
  validation.`, () => {
    const emailAddr = ' user@example.com';
    const validator = StringValidators.email({ trimBeforeValidation: true });
    expect(validator.validate(emailAddr).validity).toBe(Validity.Valid);
  });

  test(`When a validMessage is provided, that message is returned as part of a 
  valid result.`, () => {
    const validMessage = 'The email address is valid.';
    const valdiator = StringValidators.email({ validMessage });
    const emailAddr = 'user@example.com';
    expect(valdiator.validate(emailAddr)).toStrictEqual({
      validity: Validity.Valid,
      message: {
        text: validMessage,
        validity: Validity.Valid,
      },
    });
  });

  test(`When an invalidMessage is provided, that message is returned as part of 
  an invalid result.`, () => {
    const invalidMessage = 'Please enter a valid email address.';
    const valdiator = StringValidators.email({ invalidMessage });
    const emailAddr = 'not.an.email';
    expect(valdiator.validate(emailAddr)).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: invalidMessage,
        validity: Validity.Invalid,
      },
    });
  });
});
