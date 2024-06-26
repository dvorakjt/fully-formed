import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  CombinedValidatorSuite,
  StringValidators,
  Validity,
  type ValidatorTemplate,
  type AsyncValidatorTemplate,
  CancelableObservable,
} from '../../../model';
import { MockAsyncValidator, delay } from '../../../test-utils';

describe('CombinedValidatorSuite', () => {
  test(`When validate() is called and its synchronous validators produce an 
  invalid result, the returned syncResult has a validity of Validity.Invalid and 
  no observableResult is returned.`, () => {
    const validatorSuite = new CombinedValidatorSuite<string>({
      validators: [StringValidators.required()],
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: (value): Promise<boolean> =>
            Promise.resolve(/[A-Z]/.test(value)),
        }),
      ],
    });
    const value = '';
    const { syncResult, observableResult } = validatorSuite.validate(value);
    expect(syncResult).toStrictEqual({
      value,
      validity: Validity.Invalid,
      messages: [],
    });
    expect(observableResult).toBeUndefined();
  });

  test(`If no async validators or templates were provided to its constructor, 
  when validate() is called and its synchronous validators produce a valid 
  result, the returned syncResult has a validity of Validity.Valid and no 
  observableResult is returned.`, () => {
    const validatorSuite = new CombinedValidatorSuite<string>({});
    const value = '';
    const { syncResult, observableResult } = validatorSuite.validate(value);
    expect(syncResult).toStrictEqual({
      value,
      validity: Validity.Valid,
      messages: [],
    });
    expect(observableResult).toBeUndefined();
  });

  test(`If async validators were provided to its constructor, when validate() 
  is called and its synchronous validators produce a valid result, the returned
   syncResult has a validity of Validity.Pending, and an observableResult is 
   returned.`, () => {
    const validatorSuite = new CombinedValidatorSuite<string>({
      validators: [StringValidators.required()],
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: (value): Promise<boolean> =>
            Promise.resolve(/[A-Z]/.test(value)),
        }),
      ],
    });
    const value = 'test';
    const { syncResult, observableResult } = validatorSuite.validate(value);
    expect(syncResult).toStrictEqual({
      value,
      validity: Validity.Pending,
      messages: [],
    });
    expect(observableResult).toBeInstanceOf(CancelableObservable);
  });

  test(`If async validators and a pendingMessage were provided to its 
  constructor, when validate() is called and its synchronous validators produce 
  a valid result, the returned syncResult includes the pendingMessage.`, () => {
    const pendingMessage = 'Performing some asynchronous check...';
    const validatorSuite = new CombinedValidatorSuite<string>({
      validators: [StringValidators.required()],
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: (value): Promise<boolean> =>
            Promise.resolve(/[A-Z]/.test(value)),
        }),
      ],
      pendingMessage,
    });
    const value = 'test';
    const { syncResult } = validatorSuite.validate(value);
    expect(syncResult.messages).toStrictEqual([
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);
  });

  test(`When validate() is called and validatorTemplates have been passed into 
  its constructor, it executes the validate() method of each Validator it 
  instantiated with those templates.`, () => {
    const requiredTemplate: ValidatorTemplate<string> = {
      predicate: value => {
        return value.length > 0;
      },
      validMessage: 'The field is not an empty string.',
    };
    const containsUpperTemplate: ValidatorTemplate<string> = {
      predicate: value => {
        return /[A-Z]/.test(value);
      },
      invalidMessage: 'The field does not contain an uppercase character.',
    };
    const validatorSuite = new CombinedValidatorSuite<string>({
      validatorTemplates: [requiredTemplate, containsUpperTemplate],
    });
    const value = 'a';
    expect(validatorSuite.validate(value).syncResult).toStrictEqual({
      value,
      validity: Validity.Invalid,
      messages: [
        {
          text: requiredTemplate.validMessage,
          validity: Validity.Valid,
        },
        {
          text: containsUpperTemplate.invalidMessage,
          validity: Validity.Invalid,
        },
      ],
    });
  });

  test(`When validate() is called and asyncValidatorTemplates have been passed 
  into its constructor, it executes the validate() method of each AsyncValidator 
  it instantiated with those templates.`, () => {
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
    const validatorSuite = new CombinedValidatorSuite<string>({
      asyncValidatorTemplates: [
        asyncRequiredTemplate,
        asyncIncludesUpperTemplate,
      ],
      delayAsyncValidatorExecution: 0,
    });
    const value = 'a';

    const { observableResult } = validatorSuite.validate(value);
    expect(observableResult).toBeInstanceOf(CancelableObservable);

    observableResult?.subscribe(result => {
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

  test(`The validate method of its async validators is not called if the 
  unsubscribeAndCancel() method of the CancelableSubscription returned by the
  observableResult returned by its own validate method is called.`, async () => {
    const asyncValidators = new Array(10).fill(null).map(() => {
      return new MockAsyncValidator<string>();
    });

    const validatorSuite = new CombinedValidatorSuite<string>({
      asyncValidators,
      delayAsyncValidatorExecution: 500,
    });

    const { observableResult } = validatorSuite.validate('test');
    expect(observableResult).toBeInstanceOf(CancelableObservable);

    const subscription = observableResult!.subscribe();
    subscription.unsubscribeAndCancel();

    await delay(1000);

    for (const validator of asyncValidators) {
      expect(validator.validate).not.toHaveBeenCalled();
    }
  });

  test(`The validate methods of its async validators are executed once the 
  provided delay duration has elapsed.`, async () => {
    const validatorSuite = new CombinedValidatorSuite<string>({
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: (): Promise<boolean> => Promise.resolve(true),
        }),
      ],
      delayAsyncValidatorExecution: 500,
    });

    const { observableResult } = validatorSuite.validate('test');
    expect(observableResult).toBeDefined();

    const subscriptionTimestamp = Date.now();

    observableResult!.subscribe(() => {
      const executionTimestamp = Date.now();
      const difference = executionTimestamp - subscriptionTimestamp;
      console.log(
        `CombinedValidatorSuite executed async validators after ${difference}ms.`,
      );
      expect(difference).toBeGreaterThanOrEqual(500);
    });

    await delay(1000);
  });
});
