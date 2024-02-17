import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  Validity,
  type AsyncPredicate,
} from '../../../../../model';

describe('AsyncValidator', () => {
  const asyncRequired: AsyncPredicate<string> = value =>
    Promise.resolve(value.length > 0);

  test('When validate() is called and the Promise returned by its predicate resolves to true, the Observable it returns emits an object with a validity property of Validity.Valid', () => {
    new AsyncValidator<string>({ predicate: asyncRequired })
      .validate('test')
      .subscribe(result => {
        expect(result.validity).toBe(Validity.Valid);
      });
  });

  test('When validate() is called and the Promise returned by its predicate resolves to false, the Observable it returns emits an object with a validity property of Validity.Invalid.', () => {
    new AsyncValidator<string>({ predicate: asyncRequired })
      .validate('')
      .subscribe(result => {
        expect(result.validity).toBe(Validity.Invalid);
      });
  });

  test('When validate() is called and the Promise returned by its predicate resolves to true, the Observable it returns emits an object with a message property whose text is the validMessage passed into the constructor and whose validity is Validity.Valid.', () => {
    const message = 'Value is not an empty string.';
    new AsyncValidator<string>({
      predicate: asyncRequired,
      validMessage: message,
    })
      .validate('test')
      .subscribe(result => {
        expect(result.message).toStrictEqual({
          text: message,
          validity: Validity.Valid,
        });
      });
  });

  test('When validate() is called and the Promise returned by its predicate resolves to false, the Observable it returns emits an object with a message property whose text is the invalidMessage passed into the constructor and whose validity is Validity.Invalid.', () => {
    const message = 'Value must not be an empty string.';
    new AsyncValidator<string>({
      predicate: asyncRequired,
      invalidMessage: message,
    })
      .validate('')
      .subscribe(result => {
        expect(result.message).toStrictEqual({
          text: message,
          validity: Validity.Invalid,
        });
      });
  });
});
