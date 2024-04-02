import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  ExcludableField,
  StringValidators,
  Validity,
  Validator,
  type ControlledExcludableFieldState,
  type AsyncValidatorTemplate,
  type ValidatorTemplate,
} from '../../../../../model';
import { PromiseScheduler } from '../../../../../test-utils';

describe('ExcludableField', () => {
  test('After instantiation, its value is set to the default value passed into its constructor.', () => {
    const defaultValue = 'test';
    const field = new ExcludableField({ name: 'testField', defaultValue });
    expect(field.state.value).toBe(defaultValue);
  });

  test('After instantiation, if no async validators were passed into the constructor, its validity and messages properties are set according to the results of any sync validators passed into its constructor.', () => {
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
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
    });
  });

  const asyncIncludesUpper = new AsyncValidator<string>({
    predicate: (value): Promise<boolean> =>
      Promise.resolve(/[A-Z]/.test(value)),
  });

  test('After instantiation, if async validators were passed into the constructor but its sync validators returned an invalid result, its validity and messages properties are set according to the results of the sync validators.', () => {
    const defaultValue = '';
    const invalidMessage = 'testField must not be an empty string.';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [StringValidators.required({ invalidMessage })],
      asyncValidators: [asyncIncludesUpper],
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
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
    });
  });

  test('After instantiation, if async validators have been passed into the constructor and sync validators return a valid result, the validity of the field is set to Validity.Pending until the async validators return.', () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
    });
    expect(field.state.validity).toBe(Validity.Pending);
  });

  test('After instantiation, if both async validators and a pending message were passed into the constructor and sync validators return a valid result, the messages property of the state of the field includes the pending message.', () => {
    const pendingMessage = 'Performing async validation...';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      pendingMessage,
    });
    expect(field.state.messages).toStrictEqual([
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);
  });

  test('After instantiation, if async validators have been passed into the constructor, the value, validity and messages properties of the field are set according to the results of those validators once they resolve.', () => {
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
        focused: false,
        visited: false,
        modified: false,
        exclude: false,
      });
    });
  });

  test("After instantiation, if both async validators and a pending message were passed into the constructor, the pending message is removed from the Field state's messages array when the async validators resolve.", () => {
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

  test('After instantiation, the focused property of the state of the field is set to false by default.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.focused).toBe(false);
  });

  test('After instantiation, the focused property of the state of the field is set to focusedByDefault.', () => {
    const focused = new ExcludableField({
      name: 'focused',
      defaultValue: '',
      focusedByDefault: true,
    });
    const unfocused = new ExcludableField({
      name: 'unfocused',
      defaultValue: '',
      focusedByDefault: false,
    });
    expect(focused.state.focused).toBe(true);
    expect(unfocused.state.focused).toBe(false);
  });

  test('After instantiation, the visited property of the state of the field is set to false by default.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.visited).toBe(false);
  });

  test('After instantiation, the visited property of the state of the field is set to visitedByDefault.', () => {
    const visited = new ExcludableField({
      name: 'visited',
      defaultValue: '',
      visitedByDefault: true,
    });
    const unvisited = new ExcludableField({
      name: 'unvisited',
      defaultValue: '',
      visitedByDefault: false,
    });
    expect(visited.state.visited).toBe(true);
    expect(unvisited.state.visited).toBe(false);
  });

  test('After instantiation, the modified property of the state of the field is set to false by default.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.modified).toBe(false);
  });

  test('After instantiation, the modified property of the state of the field is set to modifiedByDefault.', () => {
    const modified = new ExcludableField({
      name: 'modified',
      defaultValue: '',
      modifiedByDefault: true,
    });
    const unmodified = new ExcludableField({
      name: 'unmodified',
      defaultValue: '',
      modifiedByDefault: false,
    });
    expect(modified.state.modified).toBe(true);
    expect(unmodified.state.modified).toBe(false);
  });

  test('After instantiation, the exclude property of the state of the field is set to false by default.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.exclude).toBe(false);
  });

  test('After instantiation, the exclude property of the state of the field is set to excludeByDefault.', () => {
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

  test('When setValue() is called, the value property of the state of the field is set.', () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
    });
    const updatedValue = field.state.value.toUpperCase();
    field.setValue(updatedValue);
    expect(field.state.value).toBe(updatedValue);
  });

  test('When setValue() is called, the modified property of the state of the field is set to true.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.modified).toBe(false);
    field.setValue('test');
    expect(field.state.modified).toBe(true);
  });

  test('When setValue() is called, if no async validators were passed into the constructor, its validity and messages properties are set according to the results of any sync validators passed into its constructor.', () => {
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
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
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
      modified: true,
      focused: false,
      visited: false,
      exclude: false,
    });
  });

  test('When setValue() is called, if async validators were passed into the constructor but its sync validators returned an invalid result, its validity and messages properties are set according to the results of the sync validators.', () => {
    const invalidMessage = 'testField must not be an empty string.';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required({ invalidMessage })],
      asyncValidators: [asyncIncludesUpper],
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
      modified: true,
      focused: false,
      visited: false,
      exclude: false,
    });
  });

  test('When setValue() is called, if async validators have been passed into the constructor and sync validators return a valid result, the validity of the field is set to Validity.Pending until the async validators return.', () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
    });
    field.setValue('test');
    expect(field.state.validity).toBe(Validity.Pending);
  });

  test('When setValue() is called, if both async validators and a pending message were passed into the constructor and sync validators return a valid result, the messages property of the state of the Field includes the pending message.', () => {
    const pendingMessage = 'Performing async validation...';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      pendingMessage,
    });
    field.setValue('test');
    expect(field.state.messages).toStrictEqual([
      {
        text: pendingMessage,
        validity: Validity.Pending,
      },
    ]);
  });

  test('When setValue() is called, if async validators have been passed into the constructor, the value, validity and messages properties of the field are set according to the results of those validators once they resolve.', () => {
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
        modified: true,
        focused: false,
        visited: false,
        exclude: false,
      });
    });
  });

  test("When setValue() is called, if both async validators and a pending message were passed into the constructor, the pending message is removed from the Field state's messages array when the async validators resolve.", () => {
    const pendingMessage = 'Performing async validation...';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      pendingMessage,
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

  test('When setValue() is called while there are still pending async validators, the results of those validators are ignored.', () => {
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
        modified: true,
        focused: false,
        visited: false,
        exclude: false,
      });
    });
    field.setValue(updatedValue);
    promiseScheduler.resolveAll();
  });

  test('When setExclude() is called, the exclude property of the state of the field is set.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.exclude).toBe(false);
    field.setExclude(true);
    expect(field.state.exclude).toBe(true);
    field.setExclude(false);
    expect(field.state.exclude).toBe(false);
  });

  test("When validator templates were passed into its constructor, those templates are used to instantiate Validators which validate the field's value.", () => {
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
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
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
      modified: true,
      focused: false,
      visited: false,
      exclude: false,
    });
  });

  test("When async validator templates were passed into its constructor, those templates are used to instantiate AsyncValidators which validate the field's value.", () => {
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
        focused: false,
        visited: false,
        modified: false,
        exclude: false,
      });
    });
  });

  test('When focus() is called, the focused property of the state of the field is set to true.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.focused).toBe(false);
    field.focus();
    expect(field.state.focused).toBe(true);
  });

  test('When visit() is called, the visited property of the state of the field is set to true.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.visited).toBe(false);
    field.visit();
    expect(field.state.visited).toBe(true);
  });

  test('When controllers and a control function were passed into its constructor, that function is called after setting the default value of the field.', () => {
    const birthday = new ExcludableField({
      name: 'birthday',
      defaultValue: '1990-01-01',
      validators: [
        new Validator<string>({
          predicate: (value): boolean => {
            return !Number.isNaN(new Date(value).getMilliseconds());
          },
        }),
      ],
      excludeByDefault: true,
    });
    const age = new ExcludableField({
      name: 'age',
      defaultValue: 0,
      controlledBy: {
        controllers: [birthday],
        controlFn: (
          [birthdayState],
          ownState,
        ): ControlledExcludableFieldState<number> => {
          const updatedOwnState = {
            ...ownState,
            exclude: birthdayState.exclude,
          };

          if (birthday.state.validity !== Validity.Valid) {
            return updatedOwnState;
          }

          const difference = 2024 - Number(birthdayState.value.slice(0, 4));
          if (difference < 0) return updatedOwnState;

          return {
            value: difference,
            validity: Validity.Valid,
            messages: [],
            exclude: birthday.state.exclude,
          };
        },
      },
    });
    expect(age.state).toStrictEqual({
      value: 34,
      validity: Validity.Valid,
      messages: [],
      focused: false,
      visited: false,
      modified: false,
      exclude: true,
    });
  });

  test('When controllers and a control function were passed into its constructor, that function updates the state of the field when the state of any controller is updated.', () => {
    const birthday = new ExcludableField({
      name: 'birthday',
      defaultValue: '1990-01-01',
      validators: [
        new Validator<string>({
          predicate: (value): boolean => {
            return !Number.isNaN(new Date(value).getMilliseconds());
          },
        }),
      ],
    });
    const age = new ExcludableField({
      name: 'age',
      defaultValue: 0,
      controlledBy: {
        controllers: [birthday],
        controlFn: (
          [birthdayState],
          ownState,
        ): ControlledExcludableFieldState<number> => {
          const updatedOwnState = {
            ...ownState,
            exclude: birthdayState.exclude,
          };

          if (birthday.state.validity !== Validity.Valid) {
            return updatedOwnState;
          }

          const difference = 2024 - Number(birthdayState.value.slice(0, 4));
          if (difference < 0) return updatedOwnState;

          return {
            value: difference,
            validity: Validity.Valid,
            messages: [],
            exclude: birthday.state.exclude,
          };
        },
      },
    });
    birthday.setValue('1984-01-01');
    birthday.setExclude(true);
    expect(age.state).toStrictEqual({
      value: 40,
      validity: Validity.Valid,
      messages: [],
      focused: false,
      visited: false,
      modified: false,
      exclude: true,
    });
  });

  test('When reset() is called, its value is set to the default value passed into its constructor.', () => {
    const defaultValue = '';
    const field = new ExcludableField({ name: 'testField', defaultValue });
    const updatedValue = 'test';
    field.setValue(updatedValue);
    expect(field.state.value).toBe(updatedValue);
    field.reset();
    expect(field.state.value).toBe(defaultValue);
  });

  test('When reset() is called, if no async validators were passed into the constructor, its validity and messages properties are set according to the results of any sync validators passed into its constructor.', () => {
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
      modified: true,
      focused: false,
      visited: false,
      exclude: false,
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
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
    });
  });

  test('When reset() is called, if async validators were passed into the constructor but its sync validators returned an invalid result, its validity and messages properties are set according to the results of the sync validators.', () => {
    const defaultValue = '';
    const invalidMessage = 'testField must not be an empty string.';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue,
      validators: [StringValidators.required({ invalidMessage })],
      asyncValidators: [asyncIncludesUpper],
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
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
    });
  });

  test('When reset() is called, if async validators have been passed into the constructor and sync validators return a valid result, the validity of the field is set to Validity.Pending until the async validators return.', () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
    });
    field.setValue('');
    expect(field.state.validity).toBe(Validity.Invalid);
    field.reset();
    expect(field.state.validity).toBe(Validity.Pending);
  });

  test('When reset() is called, if both async validators and a pending message were passed into the constructor and sync validators return a valid result, the messages property of the state of the field includes the pending message.', () => {
    const pendingMessage = 'Performing async validation...';
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
      pendingMessage,
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

  test('When reset() is called, if async validators have been passed into the constructor, the value, validity and messages properties of the field are set according to the results of those validators once they resolve.', () => {
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
        focused: false,
        visited: false,
        modified: false,
        exclude: false,
      });
    });
  });

  test("When reset() is called, if both async validators and a pending message were passed into the constructor, the pending message is removed from the field state's messages array when the async validators resolve.", () => {
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

  test('When reset() is called, the focused property of the state of the field is set to focusedByDefault.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.focused).toBe(false);
    field.focus();
    expect(field.state.focused).toBe(true);
    field.reset();
    expect(field.state.focused).toBe(false);
  });

  test('When reset() is called, the visited property of the state of the field is set to visitedByDefault.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.visited).toBe(false);
    field.visit();
    expect(field.state.visited).toBe(true);
    field.reset();
    expect(field.state.visited).toBe(false);
  });

  test('When reset() is called, the modified property of the state of the field is set to modifiedByDefault.', () => {
    const field = new ExcludableField({ name: 'testField', defaultValue: '' });
    expect(field.state.modified).toBe(false);
    field.setValue('test');
    expect(field.state.modified).toBe(true);
    field.reset();
    expect(field.state.modified).toBe(false);
  });

  test('When reset() is called, the exclude property of the state of the field is set to excludeByDefault.', () => {
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

  test("When reset() is called and controllers and a control function were passed into the constructor, the control function is called after setting the field's value to its default value.", () => {
    const birthday = new ExcludableField({
      name: 'birthday',
      defaultValue: '1990-01-01',
      validators: [
        new Validator<string>({
          predicate: (value): boolean => {
            return !Number.isNaN(new Date(value).getMilliseconds());
          },
        }),
      ],
    });
    const age = new ExcludableField({
      name: 'age',
      defaultValue: 0,
      controlledBy: {
        controllers: [birthday],
        controlFn: (
          [birthdayState],
          ownState,
        ): ControlledExcludableFieldState<number> => {
          if (birthdayState.validity !== Validity.Valid) {
            return ownState;
          }
          const difference = 2024 - Number(birthdayState.value.slice(0, 4));
          if (difference < 0) return ownState;

          return {
            value: difference,
            validity: Validity.Valid,
            messages: [],
          };
        },
      },
    });
    age.setValue(9999);
    age.reset();
    expect(age.state.value).toBe(34);
  });

  test('When the controlFn returns an object that contains a value, if there is a pending async validator suite, it is ignored.', () => {
    const promiseScheduler = new PromiseScheduler();
    const complementaryColors = {
      red: 'green',
      yellow: 'purple',
      blue: 'orange',
      green: 'red',
      purple: 'yellow',
      orange: 'blue',
    };
    const isValidColorAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(
          value in complementaryColors,
        );
      },
      invalidMessage: 'Please enter a valid color.',
    });
    const color = new ExcludableField({
      name: 'color',
      defaultValue: '',
    });
    const complement = new ExcludableField({
      name: 'complement',
      defaultValue: '',
      asyncValidators: [isValidColorAsync],
      controlledBy: {
        controllers: [color],
        controlFn: ([colorState]):
          | ControlledExcludableFieldState<string>
          | undefined => {
          if (!(colorState.value in complementaryColors)) return;
          return {
            value:
              complementaryColors[
                colorState.value as keyof typeof complementaryColors
              ],
            validity: Validity.Valid,
            messages: [],
          };
        },
      },
    });
    complement.subscribeToState(state => {
      expect(state.value).toBe(complementaryColors.yellow);
    });
    // Resolve the Promise created by the initial call to isValidColorAsync.
    // This will be ignored because the controlFn has run after that call was made.
    promiseScheduler.resolveAll();
    // Set the value of color to 'yellow' (complement of purple). This should set the value of
    // complement to 'purple'
    color.setValue(complementaryColors.purple);
  });
});
