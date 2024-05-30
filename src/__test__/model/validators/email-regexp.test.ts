import { describe, test, expect, beforeEach } from 'vitest';
import { EmailRegExp } from '../../../model';

describe('EmailRegExp', () => {
  let regex: EmailRegExp;

  beforeEach(() => {
    regex = new EmailRegExp();
  });

  test('It returns an instance of RegExp.', () => {
    expect(regex).toBeInstanceOf(RegExp);
  });

  test(`It returns a RegExp that fails to match a string that does not include 
  an @ symbol.`, () => {
    const email = `john.doeexample.com`;
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that fails to match an email address with no local
  part.`, () => {
    const email = '@example.com';
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that fails to match an email address with a local 
  part that is 65 characters long.`, () => {
    const localPart = 'a'.repeat(65);
    const email = `${localPart}@example.com`;
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that matches an email address with a local part that 
  is one character in length.`, () => {
    const email = 'a@example.com';
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that matches an email address with a local part that 
  is 64 characters in length.`, () => {
    const localPart = 'a'.repeat(64);
    const email = `${localPart}@example.com`;
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that fails to match an email address with a domain 
  that is 3 characters in length.`, () => {
    const email = 'user@a.a';
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that fails to match an email address with a domain 
  that is 256 characters in length.`, () => {
    const dnsLabel = 'a'.repeat(62) + '.';
    const domain = dnsLabel.repeat(4) + 'site';
    const email = `user@${domain}`;
    expect(domain.length).toBe(256);
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that matches an email address with a domain that is
  4 characters in length.`, () => {
    const email = 'user@a.io';
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that matches an email address with a domain that is
  255 characters in length.`, () => {
    const dnsLabel = 'a'.repeat(62) + '.';
    const domain = dnsLabel.repeat(4) + 'com';
    const email = `user@${domain}`;
    expect(domain.length).toBe(255);
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that fails to match an email address with a local 
  part that begins with a period.`, () => {
    const email = '.user@example.com';
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that fails to match an email address with a local 
  part that ends with a period.`, () => {
    const email = 'user.@example.com';
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that fails to match an email address with a local 
  part that contains consecutive periods.`, () => {
    const email = 'john..doe@example.com';
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that matches an email address that contains only 
  non-consecutive periods at neither the beginning nor the end of the local 
  part.`, () => {
    const email = 'john.doe.jr@example.com';
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that fails to match an email address that contains 
  non-printable characters in the local part.`, () => {
    const nonPrintableCharacters = String.raw`()[]\;,<>@:"`;

    for (const char of nonPrintableCharacters) {
      const email = `${char}@example.com`;
      expect(regex.test(email)).toBe(false);
    }
  });

  test(`It returns a RegExp that fails to match an email address that contains 
  space or control characters in the local part.`, () => {
    let spaceOrControlChar: string;

    for (let i = 0; i <= 31; i++) {
      spaceOrControlChar = String.fromCharCode(i);
      const email = `${spaceOrControlChar}@example.com`;
      expect(regex.test(email)).toBe(false);
    }

    spaceOrControlChar = String.fromCharCode(127);
    expect(regex.test(spaceOrControlChar)).toBe(false);
  });

  test(`It returns a RegExp that matches an email address that contains only
  alphabetical characters in the local part.`, () => {
    const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz';

    for (const letter of lowercaseAlphabet) {
      const lowercase = `${letter}@example.com`;
      const uppercase = `${letter.toUpperCase()}@example.com`;
      expect(regex.test(lowercase)).toBe(true);
      expect(regex.test(uppercase)).toBe(true);
    }
  });

  test(`It returns a RegExp that matches an email address that contains only
  digits in the local part.`, () => {
    for (let i = 0; i <= 9; i++) {
      const email = `${i}@example.com`;
      expect(regex.test(email)).toBe(true);
    }
  });

  test(`It returns a RegExp that matches an email address that contains only
  printable symbols in the local part.`, () => {
    const printableCharacters = `!#$%&'*+-/=?^_\`{|}~`;
    for (const char of printableCharacters) {
      const email = `${char}@example.com`;
      expect(regex.test(email)).toBe(true);
    }
  });

  test(`It returns a RegExp that fails to match an email address that contains 
  no DNS labels.`, () => {
    const email = 'user@.com';
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that fails to match an email address that contains a
  DNS label that is 64 characters in length.`, () => {
    const dnsLabel = 'a'.repeat(64);
    const email = `user@${dnsLabel}.com`;
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that matches an email address that contains a 
  DNS label that is 1 character in length.`, () => {
    const email = 'user@a.io';
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that matches an email address that contains a 
  DNS label that is 63 characters in length.`, () => {
    const dnsLabel = 'a'.repeat(63);
    const email = `user@${dnsLabel}.com`;
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that fails to match an email address that contains 
  a DNS label that consists of all digits.`, () => {
    const digits = '0123456789';
    for (const digit of digits) {
      const email = `user@${digit}.com`;
      expect(regex.test(email)).toBe(false);
    }
  });

  test(`It returns a RegExp that fails to match an email address that contains 
  a DNS label beginning with a hyphen.`, () => {
    const email = `user@-example.com`;
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that fails to match an email address that contains 
  a DNS label ending with a hyphen.`, () => {
    const email = `user@example-.com`;
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that fails to match an email address with a DNS 
  label that contains consecutive hyphens.`, () => {
    const email = `user@my--site.com`;
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that matches an email address with a DNS label that 
  contains letters, numbers and hyphens, but does not start or end with a hyphen 
  or contain consecutive hyphens.`, () => {
    const dnsLabel = 'abc-XYZ-123';
    const email = `user@${dnsLabel}.com`;
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that fails to match an email address with a top 
  level domain that is 1 character long.`, () => {
    const email = `user@example.c`;
    expect(regex.test(email)).toBe(false);
  });

  test(`It returns a RegExp that matches an email address with a top level 
  domain that is 2 characters long.`, () => {
    const email = `user@example.io`;
    expect(regex.test(email)).toBe(true);
  });

  test(`It returns a RegExp that fails to match an email address with a top 
  level domain that contains non-alphabetical characters.`, () => {
    for (let i = 0; i < 'A'.charCodeAt(0); i++) {
      const topLevelDomain = String.fromCharCode(i).repeat(2);
      const email = `user@example.${topLevelDomain}`;
      expect(regex.test(email)).toBe(false);
    }

    for (let i = 'Z'.charCodeAt(0) + 1; i < 'a'.charCodeAt(0); i++) {
      const topLevelDomain = String.fromCharCode(i).repeat(2);
      const email = `user@example.${topLevelDomain}`;
      expect(regex.test(email)).toBe(false);
    }

    for (let i = 'z'.charCodeAt(0) + 1; i <= 127; i++) {
      const topLevelDomain = String.fromCharCode(i).repeat(2);
      const email = `user@example.${topLevelDomain}`;
      expect(regex.test(email)).toBe(false);
    }
  });

  test(`It returns a RegExp that matches an email address with a top level 
  domain that contains only alphabetical characters.`, () => {
    const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (const letter of lowercaseAlphabet) {
      const lowercaseTLD = letter.repeat(2);
      const uppercaseTLD = letter.toUpperCase().repeat(2);
      const lowercaseEmail = `user@example.${lowercaseTLD}`;
      const uppercaseEmail = `user@example.${uppercaseTLD}`;
      expect(regex.test(lowercaseEmail)).toBe(true);
      expect(regex.test(uppercaseEmail)).toBe(true);
    }
  });

  test(`It returns a RegExp that matches a list of valid email 
  addresses.`, () => {
    const emailAddresses = [
      'john.doe@example.com',
      'jane_smith123@example.com',
      'user+test@example.com',
      'info@mail.example.com',
      'johndoe123@subdomain.example.com',
      'testuser@example.co.uk',
      'bob.smith123@example.net',
      'alice_doe@example.org',
      'support@example.biz',
      'sales@example.info',
    ];
    for (const email of emailAddresses) {
      expect(regex.test(email)).toBe(true);
    }
  });
});
