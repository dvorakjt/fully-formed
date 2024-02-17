import { describe, test, expect } from 'vitest';
import {
  ValidatorSuite,
  StringValidators,
  Validity,
  type ValidatorTemplate,
} from '../../../../../model';

describe('ValidatorSuite', () => {
  test('When validate() is called, the value passed in as an argument is returned as a member of the result object.', () => {
    const validatorSuite = new ValidatorSuite<string>({});
    const value = 'test';
    expect(validatorSuite.validate(value).value).toBe(value);
  });

  test('When validate() is called and the ValidatorSuite contains no Validators, it returns an object with a validity property of Validity.Value.', () => {
    const validatorSuite = new ValidatorSuite<string>({});
    expect(validatorSuite.validate('').validity).toBe(Validity.Valid);
  });

  test('When validate() is called and all Validators return a result with a validity property of Validity.Valid, it returns a result with a validity property of Validity.Value.', () => {
    const validatorSuite = new ValidatorSuite<string>({
      validators: [
        StringValidators.required(),
        StringValidators.includesUpper(),
      ],
    });
    expect(validatorSuite.validate('A').validity).toBe(Validity.Valid);
  });

  test('When validate() is called and any Validator returns a result with a validity property of Validity.Invalid, it returns a result with a validity property of Validity.Invalid.', () => {
    const validatorSuite = new ValidatorSuite<string>({
      validators: [
        StringValidators.required(),
        StringValidators.includesUpper(),
      ],
    });
    expect(validatorSuite.validate('a').validity).toBe(Validity.Invalid);
  });

  test('When validate() is called and any Validator returns a message as part of its result, it returns a result object with a messages property populated with those messages.', () => {
    const isNotEmptyStringMessage = 'The field is not an empty string.';
    const doesNotContainUpperMessage =
      'The field does not contain an uppercase character.';
    const validatorSuite = new ValidatorSuite<string>({
      validators: [
        StringValidators.required({ validMessage: isNotEmptyStringMessage }),
        StringValidators.includesUpper({
          invalidMessage: doesNotContainUpperMessage,
        }),
      ],
    });
    expect(validatorSuite.validate('a').messages).toStrictEqual([
      {
        text: isNotEmptyStringMessage,
        validity: Validity.Valid,
      },
      {
        text: doesNotContainUpperMessage,
        validity: Validity.Invalid,
      },
    ]);
  });

  test('When validate() is called and templates have been passed into its constructor, it executes the validate() method of each validator it instantiated with those templates.', () => {
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
    const validatorSuite = new ValidatorSuite<string>({
      validatorTemplates: [requiredTemplate, containsUpperTemplate],
    });
    const value = 'a';
    expect(validatorSuite.validate(value)).toStrictEqual({
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
});
