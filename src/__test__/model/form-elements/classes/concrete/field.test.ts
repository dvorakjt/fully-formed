import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  Field,
  StringValidators,
  Validity,
} from '../../../../../model';

describe('Field', () => {
  test('After instantiation, its value is set to the default value passed into its constructor.', () => {
    const defaultValue = 'test';
    const field = new Field({ name: 'myField', defaultValue });
    expect(field.state.value).toBe(defaultValue);
  });

  test('After instantiation, if no async validators were passed into the constructor, its validity and messages properties are set according to the results of any sync validators passed into its constructor.', () => {
    const defaultValue = 'test';
    const validMessage = 'myField is valid.';
    const field = new Field({
      name: 'myField',
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
    const invalidMessage = 'myField must not be an empty string.';
    const field = new Field({
      name: 'myField',
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
    const field = new Field({
      name: 'myField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
    });
    expect(field.state.validity).toBe(Validity.Pending);
  });

  test('After instantiation, if both async validators and a pending message were passed into the constructor and sync validators return a valid result, the messages property of the state of the Field includes the pending message.', () => {
    const pendingMessage = 'Performing async validation...';
    const field = new Field({
      name: 'myField',
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
    const field = new Field({
      name: 'myField',
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
    const field = new Field({
      name: 'myField',
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

  test('After instantiation, the focused property of the state of the Field is set to focusedByDefault.', () => {
    const focused = new Field({
      name: 'focused',
      defaultValue: '',
      focusedByDefault: true,
    });
    const explicitlyUnfocused = new Field({
      name: 'explicitlyUnfocused',
      defaultValue: '',
      focusedByDefault: false,
    });
    const implicitlyUnfocused = new Field({
      name: 'implicitlyUnfocused',
      defaultValue: '',
    });
    expect(focused.state.focused).toBe(true);
    expect(explicitlyUnfocused.state.focused).toBe(false);
    expect(implicitlyUnfocused.state.focused).toBe(false);
  });

  test('After instantiation, the visited property of the state of the Field is set to visitedByDefault.', () => {
    const visited = new Field({
      name: 'visited',
      defaultValue: '',
      visitedByDefault: true,
    });
    const explicitlyUnvisited = new Field({
      name: 'explicitlyUnvisited',
      defaultValue: '',
      visitedByDefault: false,
    });
    const implicitlyUnvisited = new Field({
      name: 'implicitlyUnvisited',
      defaultValue: '',
    });
    expect(visited.state.visited).toBe(true);
    expect(explicitlyUnvisited.state.visited).toBe(false);
    expect(implicitlyUnvisited.state.visited).toBe(false);
  });

  test('After instantiation, the modified property of the state of the Field is set to modifiedByDefault.', () => {
    const modified = new Field({
      name: 'modified',
      defaultValue: '',
      modifiedByDefault: true,
    });
    const explicitlyUnmodified = new Field({
      name: 'explicitlyUnmodified',
      defaultValue: '',
      modifiedByDefault: false,
    });
    const implicitlyUnmodified = new Field({
      name: 'implicitlyUnmodified',
      defaultValue: '',
    });
    expect(modified.state.modified).toBe(true);
    expect(explicitlyUnmodified.state.modified).toBe(false);
    expect(implicitlyUnmodified.state.modified).toBe(false);
  });

  test('After instantiation, the exclude property of the Field is set to excludeByDefault.', () => {
    const excluded = new Field({
      name: 'excluded',
      excludable: true,
      defaultValue: '',
      excludedByDefault: true,
    });
    const explicitlyIncluded = new Field({
      name: 'explicitlyIncluded',
      excludable: true,
      defaultValue: '',
      excludedByDefault: false,
    });
    const implicitlyIncluded = new Field({
      name: 'implicitlyIncluded',
      excludable: true,
      defaultValue: '',
    });
    const nonExcludable = new Field({
      name: 'nonExcludable',
      defaultValue: '',
    });
    expect(excluded.exclude).toBe(true);
    expect(explicitlyIncluded.exclude).toBe(false);
    expect(implicitlyIncluded.exclude).toBe(false);
    expect(nonExcludable.exclude).toBe(false);
  });

  test('When setValue() is called, the value property of the state of the Field is set.', () => {
    const field = new Field({ name : 'myField', defaultValue : 'test' });
    const updatedValue = field.state.value.toUpperCase();
    field.setValue(updatedValue);
    expect(field.state.value).toBe(updatedValue);
  });
  
  test('When setValue() is called, the modified property of the state of the Field is set to true.', () => {
    const field = new Field({ name : 'myField', defaultValue : '' });
    expect(field.state.modified).toBe(false);
    field.setValue('test');
    expect(field.state.modified).toBe(true);
  });
  
  test('When setValue() is called, if no async validators were passed into the constructor, its validity and messages properties are set according to the results of any sync validators passed into its constructor.', () => {
    const defaultValue = '';
    const invalidMessage = 'myField must not be an empty string.';
    const validMessage = 'myField is valid.';
    const field = new Field({
      name : 'myField',
      defaultValue,
      validators : [StringValidators.required({ validMessage, invalidMessage })]
    });
    expect(field.state).toStrictEqual({
      value : defaultValue,
      validity : Validity.Invalid,
      messages : [
        {
          text : invalidMessage,
          validity : Validity.Invalid
        }
      ],
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
    });
    const updatedValue = 'test';
    field.setValue(updatedValue);
    expect(field.state).toStrictEqual({
      value : updatedValue,
      validity : Validity.Valid,
      messages : [
        {
          text : validMessage,
          validity : Validity.Valid
        }
      ],
      modified : true,
      focused: false,
      visited: false,
      exclude: false,
    });
  });
  
  /*
  test('When setValue() is called, if async validators were passed into the constructor but its sync validators returned an invalid result, its validity and messages properties are set according to the results of the sync validators.', () => {});
  test('When setValue() is called, if async validators have been passed into the constructor and sync validators return a valid result, the validity of the field is set to Validity.Pending until the async validators return.', () => {});
  test('When setValue() is called, if both async validators and a pending message were passed into the constructor and sync validators return a valid result, the messages property of the state of the Field includes the pending message.', () => {});
  test('When setValue() is called, if async validators have been passed into the constructor, the value, validity and messages properties of the field are set according to the results of those validators once they resolve.', () => {});
  test("When setValue() is called, if both async validators and a pending message were passed into the constructor, the pending message is removed from the Field state's messages array when the async validators resolve.", () => {});
  test('When setValue() is called while there are still pending async validators, the results of those validators are ignored.', () => {});

  test("When validator templates were passed into its constructor, those templates are used to instantiate Validators which validate the Field's value.", () => {});
  test("When async validator templates were passed into its constructor, those templates are used to instantiate AsyncValidators which validate the Field's value.", () => {});

  test('When focus() is called, the focused property of the state of the Field is set to true.', () => {});
  test('When visit() is called, the visited property of the state of the Field is set to true.', () => {});

  test("When exclude is set, the Field's exclude property is updated.", () => {});
  test('When exclude is set, the exclude property of the state of the Field is set.', () => {});

  test('When controllers and a control function were passed into its constructor, that function is called after setting the default value of the Field.', () => {});
  test('When controllers and a control function were passed into its constructor, that function updates the state of the field when the state of any controller is updated.', () => {});

  test('When reset() is called, its value is set to the default value passed into its constructor.', () => {});
  test('When reset() is called, if no async validators were passed into the constructor, its validity and messages properties are set according to the results of any sync validators passed into its constructor.', () => {});
  test('When reset() is called, if async validators were passed into the constructor but its sync validators returned an invalid result, its validity and messages properties are set according to the results of the sync validators.', () => {});
  test('When reset() is called, if async validators have been passed into the constructor and sync validators return a valid result, the validity of the field is set to Validity.Pending until the async validators return.', () => {});
  test('When reset() is called, if both async validators and a pending message were passed into the constructor and sync validators return a valid result, the messages property of the state of the Field includes the pending message.', () => {});
  test('When reset() is called, if async validators have been passed into the constructor, the value, validity and messages properties of the field are set according to the results of those validators once they resolve.', () => {});
  test("When reset() is called, if both async validators and a pending message were passed into the constructor, the pending message is removed from the Field state's messages array when the async validators resolve.", () => {});

  test('When reset() is called, the focused property of the state of the Field is set to focusedByDefault.', () => {});
  test('When reset() is called, the visited property of the state of the Field is set to visitedByDefault.', () => {});
  test('When reset() is called, the modified property of the state of the Field is set to modifiedByDefault.', () => {});
  test('When reset() is called, the exclude property of the Field is set to excludeByDefault.', () => {});
  test("When reset() is called and controllers and a control function were passed into the constructor, the control function is called after setting the Field's value to its default value.", () => {});

  test('When the state of the Field is updated, the updated state is emitted to subscribers.', () => {});
  */
});
