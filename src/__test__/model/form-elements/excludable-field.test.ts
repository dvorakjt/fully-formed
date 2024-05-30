import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  ExcludableField,
  StringValidators,
  Validity,
  type AsyncValidatorTemplate,
  type ValidatorTemplate,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';

describe('ExcludableField', () => {
  test(`Its value is initialized to the default value passed into its 
  constructor.`, () => {
    const defaultValue = 'test';
    const field = new ExcludableField({ name: 'testField', defaultValue });
    expect(field.state.value).toBe(defaultValue);
  });

  test(`After instantiation, if no async validators were passed into its 
  constructor, its validity and messages properties are set according to the
   results of any sync validators it received.`, () => {
    const defaultValue = 'test';
    const validMessage = 'testField is valid.';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [StringValidators.required({ validMessage })],
    });
    expect(field.state).toStrictEqual({
      value: defaultValue,
      validity: Validity.Valid,
      messages: [
        {
          text: validMessage,
          validity: Validity.Valid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  const asyncIncludesUpper = new AsyncValidator<string>({
    predicate: (value): Promise<boolean> =>
      Promise.resolve(/[A-Z]/.test(value)),
  });

  test(`After instantiation, if async validators were passed into its 
  constructor but its sync validators returned an invalid result, its validity 
  and messages properties are set according to the results of the 
  sync validators.`, () => {
    const defaultValue = '';
    const invalidMessage = 'testField must not be an empty string.';

    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [StringValidators.required({ invalidMessage })],
      asyncValidators: [asyncIncludesUpper],
      delayAsyncValidatorExecution: 0,
    });

    expect(field.state).toStrictEqual({
      value: defaultValue,
      validity: Validity.Invalid,
      messages: [
        {
          text: invalidMessage,
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`After instantiation, if async validators have been passed into the 
  constructor and sync validators return a valid result, the validity of the 
  field is set to Validity.Pending until the async validators return.`, () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      delayAsyncValidatorExecution: 0,
    });
    expect(field.state.validity).toBe(Validity.Pending);
  });

  test(`After instantiation, if both async validators and a pending message were 
  passed into its constructor and sync validators return a valid result, the 
  messages property of the state of the field includes the pending message.`, () => {
    const pendingMessage = 'Performing async validation...';

    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      pendingMessage,
      delayAsyncValidatorExecution: 0,
    });

    expect(field.state.messages).toStrictEqual([
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);
  });

  test(`After instantiation, if async validators have been passed into its 
  constructor, the value, validity and messages properties of the field are set 
  according to the results of those validators once they resolve.`, () => {
    const validMessage = 'The provided value includes an uppercase letter.';

    const asyncIncludesUpperWithValidMessage = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
      validMessage,
    });

    const defaultValue = 'A';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      asyncValidators: [asyncIncludesUpperWithValidMessage],
      delayAsyncValidatorExecution: 0,
    });

    field.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: defaultValue,
        validity: Validity.Valid,
        messages: [
          {
            text: validMessage,
            validity: Validity.Valid,
          },
        ],
        exclude: false,
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });
  });

  test(`After instantiation, if both async validators and a pending message were 
  passed into the constructor, the pending message is removed from its 
  states.messsages array when the async validators resolve.`, () => {
    const pendingMessage = 'Performing async validation...';
    const syncValidMessage = 'The provided value is not an empty string.';
    const asyncValidMessage =
      'The provided value includes an uppercase letter.';

    const asyncIncludesUpperWithValidMessage = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
      validMessage: asyncValidMessage,
    });

    const defaultValue = 'A';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [
        StringValidators.required({ validMessage: syncValidMessage }),
      ],
      asyncValidators: [asyncIncludesUpperWithValidMessage],
      pendingMessage,
      delayAsyncValidatorExecution: 0,
    });

    expect(field.state.messages).toStrictEqual([
      {
        text: syncValidMessage,
        validity: Validity.Valid,
      },
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);
    field.subscribeToState(({ messages }) => {
      expect(messages).toStrictEqual([
        {
          text: syncValidMessage,
          validity: Validity.Valid,
        },
        {
          text: asyncValidMessage,
          validity: Validity.Valid,
        },
      ]);
    });
  });

  test(`After instantiation, the isInFocus property of the state of the field is 
  set to false.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.isInFocus).toBe(false);
  });

  test(`After instantiation, the hasBeenBlurred property of the state of the 
  field is set to false.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.hasBeenBlurred).toBe(false);
  });

  test(`After instantiation, the hasBeenModified property of the state of the 
  field is set to false by default.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.hasBeenModified).toBe(false);
  });

  test(`After instantiation, the exclude property of the state of the field is 
  set to false by default.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.exclude).toBe(false);
  });

  test(`After instantiation, the exclude property of the state of the field is 
  set to excludeByDefault.`, () => {
    const exclude = new ExcludableField({
      name: 'exclude',
      defaultValue: '',
      excludeByDefault: true,
    });
    const include = new ExcludableField({
      name: 'include',
      defaultValue: '',
      excludeByDefault: false,
    });
    expect(exclude.state.exclude).toBe(true);
    expect(include.state.exclude).toBe(false);
  });

  test(`When setValue() is called, the value property of the state of the field 
  is set.`, () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
    });
    const updatedValue = field.state.value.toUpperCase();
    field.setValue(updatedValue);
    expect(field.state.value).toBe(updatedValue);
  });

  test(`When setValue() is called, the hasBeenModified property of the state of
  the field is set to true.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.hasBeenModified).toBe(false);

    field.setValue('test');
    expect(field.state.hasBeenModified).toBe(true);
  });

  test(`When setValue() is called, if no async validators were passed into the 
  constructor, its validity and messages properties are set according to the 
  results of any sync validators it received.`, () => {
    const defaultValue = '';
    const invalidMessage = 'testField must not be an empty string.';
    const validMessage = 'testField is valid.';

    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [StringValidators.required({ validMessage, invalidMessage })],
    });

    expect(field.state).toStrictEqual({
      value: defaultValue,
      validity: Validity.Invalid,
      messages: [
        {
          text: invalidMessage,
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    const updatedValue = 'test';
    field.setValue(updatedValue);

    expect(field.state).toStrictEqual({
      value: updatedValue,
      validity: Validity.Valid,
      messages: [
        {
          text: validMessage,
          validity: Validity.Valid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When setValue() is called, if async validators were passed into the 
  constructor but its sync validators returned an invalid result, its validity 
  and messages properties are set according to the results of the sync 
  validators.`, () => {
    const invalidMessage = 'testField must not be an empty string.';

    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required({ invalidMessage })],
      asyncValidators: [asyncIncludesUpper],
      delayAsyncValidatorExecution: 0,
    });

    const updatedValue = '';
    field.setValue(updatedValue);

    expect(field.state).toStrictEqual({
      value: updatedValue,
      validity: Validity.Invalid,
      messages: [
        {
          text: invalidMessage,
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When setValue() is called, if async validators have been passed into the 
  constructor and sync validators return a valid result, the validity of the 
  field is set to Validity.Pending until the async validators return.`, () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      delayAsyncValidatorExecution: 0,
    });
    field.setValue('test');
    expect(field.state.validity).toBe(Validity.Pending);
  });

  test(`When setValue() is called, if both async validators and a pending 
  message were passed into the constructor and sync validators return a valid 
  result, the messages property of the state of the Field includes the pending 
  message.`, () => {
    const pendingMessage = 'Performing async validation...';

    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      pendingMessage,
      delayAsyncValidatorExecution: 0,
    });

    field.setValue('test');
    expect(field.state.messages).toStrictEqual([
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);
  });

  test(`When setValue() is called, if async validators have been passed into the 
  constructor, the value, validity and messages properties of the field are set 
  according to the results of those validators once they resolve.`, () => {
    const invalidMessage = 'testField must contain an uppercase letter.';
    const asyncIncludesUpperWithInvalidMessage = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
      invalidMessage,
    });

    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpperWithInvalidMessage],
      pendingMessage: 'Performing async validation...',
      delayAsyncValidatorExecution: 0,
    });

    const updatedValue = 'test';
    field.setValue(updatedValue);

    field.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: updatedValue,
        validity: Validity.Invalid,
        messages: [
          {
            text: invalidMessage,
            validity: Validity.Invalid,
          },
        ],
        exclude: false,
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: true,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });
  });

  test(`When setValue() is called, if both async validators and a pending 
  message were passed into the constructor, the pending message is removed from 
  the Field state's messages array when the async validators resolve.`, () => {
    const pendingMessage = 'Performing async validation...';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      pendingMessage,
      delayAsyncValidatorExecution: 0,
    });

    field.setValue('test');

    expect(field.state.messages).toStrictEqual([
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);

    field.subscribeToState(state => {
      expect(state.messages).toStrictEqual([]);
    });
  });

  test(`When setValue() is called while there are still pending async 
  validators, the results of those validators are ignored.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const scheduledAsyncIncludesUpper = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(/[A-Z]/.test(value));
      },
    });

    const invalidMessage = 'testField is required.';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'TEST',
      validators: [StringValidators.required({ invalidMessage })],
      asyncValidators: [scheduledAsyncIncludesUpper],
      delayAsyncValidatorExecution: 0,
    });

    const updatedValue = '';

    field.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: updatedValue,
        validity: Validity.Invalid,
        messages: [
          {
            text: invalidMessage,
            validity: Validity.Invalid,
          },
        ],
        exclude: false,
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: true,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    field.setValue(updatedValue);
    promiseScheduler.resolveAll();
  });

  test(`When setExclude() is called, the exclude property of the state of the field is set.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.exclude).toBe(false);

    field.setExclude(true);
    expect(field.state.exclude).toBe(true);

    field.setExclude(false);
    expect(field.state.exclude).toBe(false);
  });

  test(`When validator templates were passed into its constructor, those 
  templates are used to instantiate validators.`, () => {
    const defaultValue = 'test';

    const requiredTemplate: ValidatorTemplate<string> = {
      predicate: value => {
        return value.length > 0;
      },
      invalidMessage: 'testField must not be an empty string',
      validMessage: 'testField is not an empty string.',
    };

    const containsUpperTemplate: ValidatorTemplate<string> = {
      predicate: value => {
        return /[A-Z]/.test(value);
      },
      invalidMessage: 'testField does not contain an uppercase letter.',
      validMessage: 'testField includes an uppercase letter.',
    };

    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validatorTemplates: [requiredTemplate, containsUpperTemplate],
    });

    expect(field.state).toStrictEqual({
      value: defaultValue,
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
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    const updatedValue = defaultValue.toUpperCase();

    field.setValue(updatedValue);
    expect(field.state).toStrictEqual({
      value: updatedValue,
      validity: Validity.Valid,
      messages: [
        {
          text: requiredTemplate.validMessage,
          validity: Validity.Valid,
        },
        {
          text: containsUpperTemplate.validMessage,
          validity: Validity.Valid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When async validator templates were passed into its constructor, those 
  templates are used to instantiate AsyncValidators which validate the field's 
  value.`, () => {
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

    const defaultValue = 'test';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      asyncValidatorTemplates: [
        asyncRequiredTemplate,
        asyncIncludesUpperTemplate,
      ],
      delayAsyncValidatorExecution: 0,
    });

    field.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: defaultValue,
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
        exclude: false,
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });
  });

  test(`When focus() is called, the isInFocus property of its state is set to 
  true.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.isInFocus).toBe(false);

    field.focus();
    expect(field.state.isInFocus).toBe(true);
  });

  test(`When blur() is called, the hasBeenBlurred property of its state is set
  to true.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.hasBeenBlurred).toBe(false);

    field.blur();
    expect(field.state.hasBeenBlurred).toBe(true);
  });

  test(`When blur() is called, the isInFocus property of its state is set to 
  false.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    field.focus();
    expect(field.state.isInFocus).toBe(true);

    field.blur();
    expect(field.state.isInFocus).toBe(false);
  });

  test(`When cancelFocus() is called, the isInFocus property of its state is 
  set to false.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    field.focus();
    expect(field.state.isInFocus).toBe(true);

    field.cancelFocus();
    expect(field.state.isInFocus).toBe(false);
  });

  test(`When setSubmitted() is called, the submitted property of its state 
  becomes true.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.submitted).toBe(false);

    field.setSubmitted();
    expect(field.state.submitted).toBe(true);
  });

  test(`When reset() is called, its value is set to the default value passed 
  into its constructor.`, () => {
    const defaultValue = '';
    const field = new ExcludableField({ name: 'testField', defaultValue });

    const updatedValue = 'test';
    field.setValue(updatedValue);
    expect(field.state.value).toBe(updatedValue);

    field.reset();
    expect(field.state.value).toBe(defaultValue);
  });

  test(`When reset() is called, if no async validators were passed into the 
  constructor, its validity and messages properties are set according to the 
  results of any sync validators passed into its constructor.`, () => {
    const validMessage = 'testField is valid.';
    const invalidMessage = 'testField is required.';
    const defaultValue = 'test';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [StringValidators.required({ validMessage, invalidMessage })],
    });
    const updatedValue = '';
    field.setValue(updatedValue);
    expect(field.state).toStrictEqual({
      value: updatedValue,
      validity: Validity.Invalid,
      messages: [
        {
          text: invalidMessage,
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
    field.reset();
    expect(field.state).toStrictEqual({
      value: defaultValue,
      validity: Validity.Valid,
      messages: [
        {
          text: validMessage,
          validity: Validity.Valid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When reset() is called, if async validators were passed into the 
  constructor but its sync validators returned an invalid result, its validity 
  and messages properties are set according to the results of the sync 
  validators.`, () => {
    const defaultValue = '';
    const invalidMessage = 'testField must not be an empty string.';

    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [StringValidators.required({ invalidMessage })],
      asyncValidators: [asyncIncludesUpper],
      delayAsyncValidatorExecution: 0,
    });

    field.setValue('test');
    field.reset();

    expect(field.state).toStrictEqual({
      value: defaultValue,
      validity: Validity.Invalid,
      messages: [
        {
          text: invalidMessage,
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When reset() is called, if async validators have been passed into the 
  constructor and sync validators return a valid result, the validity of the 
  field is set to Validity.Pending until the async validators return.`, () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      delayAsyncValidatorExecution: 0,
    });
    field.setValue('');
    expect(field.state.validity).toBe(Validity.Invalid);
    field.reset();
    expect(field.state.validity).toBe(Validity.Pending);
  });

  test(`When reset() is called, if both async validators and a pending message 
  were passed into the constructor and sync validators return a valid result, 
  the messages property of the state of the field includes the pending 
  message.`, () => {
    const pendingMessage = 'Performing async validation...';

    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      pendingMessage,
      delayAsyncValidatorExecution: 0,
    });

    field.setValue('');
    expect(field.state.messages).toStrictEqual([]);

    field.reset();
    expect(field.state.messages).toStrictEqual([
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);
  });

  test(`When reset() is called, if async validators have been passed into the 
  constructor, the value, validity and messages properties of the field are 
  set according to the results of those validators once they resolve.`, () => {
    const validMessage = 'The provided value includes an uppercase letter.';

    const asyncIncludesUpperWithValidMessage = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
      validMessage,
    });

    const defaultValue = 'A';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpperWithValidMessage],
      delayAsyncValidatorExecution: 0,
    });

    field.setValue('');
    field.reset();
    field.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: defaultValue,
        validity: Validity.Valid,
        messages: [
          {
            text: validMessage,
            validity: Validity.Valid,
          },
        ],
        exclude: false,
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });
  });

  test(`When reset() is called, if both async validators and a pending message 
  were passed into the constructor, the pending message is removed from its
  state.messages array when the async validators resolve.`, () => {
    const pendingMessage = 'Performing async validation...';
    const syncValidMessage = 'The provided value is not an empty string.';
    const asyncValidMessage =
      'The provided value includes an uppercase letter.';

    const asyncIncludesUpperWithValidMessage = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        Promise.resolve(/[A-Z]/.test(value)),
      validMessage: asyncValidMessage,
    });

    const defaultValue = 'A';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [
        StringValidators.required({ validMessage: syncValidMessage }),
      ],
      asyncValidators: [asyncIncludesUpperWithValidMessage],
      pendingMessage,
      delayAsyncValidatorExecution: 0,
    });

    field.setValue('');
    field.reset();
    expect(field.state.messages).toStrictEqual([
      {
        text: syncValidMessage,
        validity: Validity.Valid,
      },
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);

    field.subscribeToState(({ messages }) => {
      expect(messages).toStrictEqual([
        {
          text: syncValidMessage,
          validity: Validity.Valid,
        },
        {
          text: asyncValidMessage,
          validity: Validity.Valid,
        },
      ]);
    });
  });

  test(`When reset() is called, the hasBeenBlurred property of its state is set 
  to false.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.hasBeenBlurred).toBe(false);

    field.blur();
    expect(field.state.hasBeenBlurred).toBe(true);

    field.reset();
    expect(field.state.hasBeenBlurred).toBe(false);
  });

  test(`When reset() is called, the submitted property of its state is set to 
  false.`, () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    field.setSubmitted();
    expect(field.state.submitted).toBe(true);

    field.reset();
    expect(field.state.submitted).toBe(false);
  });

  test(`When reset() is called, the exclude property of the state of the field is set to excludeByDefault.`, () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
    });
    expect(field.state.exclude).toBe(false);
    field.setExclude(true);
    expect(field.state.exclude).toBe(true);
    field.reset();
    expect(field.state.exclude).toBe(false);
  });
});
