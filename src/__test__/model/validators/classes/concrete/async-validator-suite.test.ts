import { describe, test, expect } from 'vitest';
import {
  AsyncValidatorSuite,
  AsyncValidator,
  Validity,
  type AsyncValidatorTemplate,
} from '../../../../../model';
import {
  AsyncValidatorSuiteContainer,
  PromiseScheduler,
} from '../../../../../test-utils';

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
    const asyncRequiredTemplate: AsyncValidatorTemplate<string> = {
      predicate: (value): Promise<boolean> => Promise.resolve(value.length > 0),
      validMessage: 'The provided value is not an empty string.',
    };
    const asyncIncludesUpperTemplate: AsyncValidatorTemplate<string> = {
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
      invalidMessage:
        'The provided value does not include an uppercase letter.',
    };
    const validatorSuite = new AsyncValidatorSuite<string>({
      asyncValidatorTemplates: [
        asyncRequiredTemplate,
        asyncIncludesUpperTemplate,
      ],
    });
    const value = 'a';
    validatorSuite.validate(value).subscribe(result => {
      expect(result).toStrictEqual({
        value,
        validity: Validity.Invalid,
        messages: [
          {
            text: asyncRequiredTemplate.validMessage,
            validity: Validity.Valid,
          },
          {
            text: asyncIncludesUpperTemplate.invalidMessage,
            validity: Validity.Invalid,
          },
        ],
      });
    });
  });

  // To see this test fail, comment out the call to unsubscribeAll() in the validate() method of AsyncValidatorSuite.
  test('When validate() is called a second time before the first returned Observable has emitted a result, the results of any in-progress validators are ignored.', () => {
    /*
      Instantiate a new PromiseScheduler and use it to create an AsyncValidator whose predicate will return on demand. In this case,
      the result of the predicate is determined by whether or not it receives an empty string.
    */
    const promiseScheduler = new PromiseScheduler();
    const triggeredRequiredValidator = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });

    // Instantiate a new AsyncValidatorSuite and an AsyncValidatorSuiteContainer. The container emits any results it receives from its AsyncValidatorSuite.
    const asyncValidatorSuite = new AsyncValidatorSuite<string>({
      asyncValidators: [triggeredRequiredValidator],
    });
    const validatorSuiteContainer = new AsyncValidatorSuiteContainer({
      asyncValidatorSuite,
    });

    /*
      Initialize an array of values to pass into the container. The first value would cause the AsyncValidator to return a validity of
      Validity.Invalid, while the second would be considered valid.
    */
    const values = ['', 'test'];

    /*
      In this test, the second value will be set before the resolution of the promise created by the first invocation of the
      AsyncValidatorSuite. Therefore, the test expects that only the second value and its associated validity will ever emitted by the container.
    */
    validatorSuiteContainer.subscribe(state => {
      expect(state).toStrictEqual({
        value: values[1],
        validity: Validity.Valid,
        messages: [],
      });
    });

    for (const value of values) {
      validatorSuiteContainer.validate(value);
    }

    // Resolve the promises in order.
    promiseScheduler.resolveAll();
  });
});
