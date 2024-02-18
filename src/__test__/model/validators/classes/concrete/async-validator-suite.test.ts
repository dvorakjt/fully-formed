import { describe, test, expect } from 'vitest';
import { AsyncValidatorSuite } from '../../../../../model/validators/classes/concrete/async-validator-suite';
import { AsyncValidator, Validity, type AsyncValidatorTemplate } from '../../../../../model';

describe('AsyncValidatorSuite', () => {
  test('When validate() is called and the returned Observable emits a ValidatorSuiteResult, that object contains the provided value.', () => {
    const validatorSuite = new AsyncValidatorSuite<string>({});
    const value = 'test';
    validatorSuite.validate(value).subscribe(result => {
      expect(result.value).toBe(value);
    });
  });

  test('When validate() is called and the suite contains no validators, the Observable emits a ValidatorSuiteResult containing the value, a validity property of Validity.Value, and an empty messages array.', () => {
    const validatorSuite = new AsyncValidatorSuite<string>({});
    const value = 'test';
    validatorSuite.validate(value).subscribe(result => {
      expect(result).toStrictEqual({
        value,
        validity: Validity.Valid,
        messages: [],
      });
    });
  });

  test('When validate() is called and all validators have returned a result with a validity property of Validity.Valid, the returned Observable emits a ValidatorSuiteResult with a validity property of Validity.Valid.', () => {
    const asyncRequired = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => Promise.resolve(value.length > 0),
    });
    const asyncIncludesUpper = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
    });
    new AsyncValidatorSuite<string>({
      asyncValidators: [asyncRequired, asyncIncludesUpper],
    })
      .validate('A')
      .subscribe(result => {
        expect(result.validity).toBe(Validity.Valid);
      });
  });

  test('When validate() is called and any validator has returned a result with a validity property of Validity.Invalid, the returned Observable emits a ValidatorSuiteResult with a validity property of Validity.Invalid.', () => {
    const asyncRequired = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => Promise.resolve(value.length > 0),
    });
    const asyncIncludesUpper = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
    });
    new AsyncValidatorSuite<string>({
      asyncValidators: [asyncRequired, asyncIncludesUpper],
    })
      .validate('a')
      .subscribe(result => {
        expect(result.validity).toBe(Validity.Invalid);
      });
  });

  test('When validate() is called and any Validator returns a message as part of its result, the returned Observable emits a result object with a messages property populated with those messages.', () => {
    const requiredMessage = 'The provided value is not an empty string.';
    const includesUpperMessage =
      'The provided value does not include an uppercase letter.';
    const asyncRequired = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => Promise.resolve(value.length > 0),
      validMessage: requiredMessage,
    });
    const asyncIncludesUpper = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
      invalidMessage: includesUpperMessage,
    });
    new AsyncValidatorSuite<string>({
      asyncValidators: [asyncRequired, asyncIncludesUpper],
    })
      .validate('a')
      .subscribe(result => {
        expect(result.messages).toStrictEqual([
          {
            text: requiredMessage,
            validity: Validity.Valid,
          },
          {
            text: includesUpperMessage,
            validity: Validity.Invalid,
          },
        ]);
      });
  });

  test('When validate() is called and templates have been passed into its constructor, it executes the validate() method of each validator it instantiated with those templates.', () => {
    const asyncRequiredTemplate : AsyncValidatorTemplate<string> = {
      predicate : (value): Promise<boolean> => Promise.resolve(value.length > 0),
      validMessage : 'The provided value is not an empty string.'
    };
    const asyncIncludesUpperTemplate : AsyncValidatorTemplate<string> = {
      predicate: (value): Promise<boolean> =>
      Promise.resolve(/[A-Z]/.test(value)),
      invalidMessage : 'The provided value does not include an uppercase letter.'
    };
    const validatorSuite = new AsyncValidatorSuite<string>({ asyncValidatorTemplates : [asyncRequiredTemplate, asyncIncludesUpperTemplate]});
    const value = 'a';
    validatorSuite.validate(value).subscribe(result => {
      expect(result).toStrictEqual({
        value,
        validity : Validity.Invalid,
        messages : [
          {
            text: asyncRequiredTemplate.validMessage,
            validity: Validity.Valid,
          },
          {
            text: asyncIncludesUpperTemplate.invalidMessage,
            validity: Validity.Invalid,
          },
        ]
      })
    })
  });

  test('When validate() is called a second time before the first returned Observable has emitted a result, the results of any in-progress validators are ignored.', () => {
  });
});
