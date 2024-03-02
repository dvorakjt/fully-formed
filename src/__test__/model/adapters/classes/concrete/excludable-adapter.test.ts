import { describe, test, expect } from 'vitest';
import {
  ExcludableAdapter,
  ExcludableField,
  StringValidators,
  Validity,
  type ExcludableAdaptFnReturnType,
} from '../../../../../model';

describe('ExcludableAdapter', () => {
  test('Its value defaults to the result of applying its adaptFn to the value of its source.', () => {
    const sourceDefaultValue = 'test';
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new ExcludableAdapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): ExcludableAdaptFnReturnType<string> => {
        return {
          value: sourceState.value.toUpperCase(),
          exclude: sourceState.exclude,
        };
      },
    });
    expect(adapter.state.value).toBe(sourceDefaultValue.toUpperCase());
  });

  test('Its validity defaults to that of its source.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new ExcludableAdapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): ExcludableAdaptFnReturnType<string> => {
        return {
          value: sourceState.value.toUpperCase(),
          exclude: sourceState.exclude,
        };
      },
    });
    expect(adapter.state.validity).toBe(Validity.Invalid);
  });

  test('The exclude property of its state defaults to the result of applying its adaptFn to the value of its source.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      excludeByDefault: true,
    });
    const adapter = new ExcludableAdapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): ExcludableAdaptFnReturnType<string> => {
        return {
          value: sourceState.value.toUpperCase(),
          exclude: sourceState.exclude,
        };
      },
    });
    expect(adapter.state.exclude).toBe(true);
  });

  test('When the value of its source changes, its value is updated.', () => {
    const sourceDefaultValue = '';
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new ExcludableAdapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): ExcludableAdaptFnReturnType<string> => {
        return {
          value: sourceState.value.toUpperCase(),
          exclude: sourceState.exclude,
        };
      },
    });
    expect(adapter.state.value).toBe(sourceDefaultValue.toUpperCase());

    const updatedValue = 'test';
    source.setValue(updatedValue);
    expect(adapter.state.value).toBe(updatedValue.toUpperCase());
  });

  test('When the validity of its source changes, its validity is updated.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new ExcludableAdapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): ExcludableAdaptFnReturnType<string> => {
        return {
          value: sourceState.value.toUpperCase(),
          exclude: sourceState.exclude,
        };
      },
    });
    expect(adapter.state.validity).toBe(Validity.Invalid);

    source.setValue('test');
    expect(adapter.state.validity).toBe(Validity.Valid);
  });

  test('When the state of its source changes, the exclude property of the state of the adapter is updated.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
      excludeByDefault: true,
    });
    const adapter = new ExcludableAdapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): ExcludableAdaptFnReturnType<string> => {
        return {
          value: sourceState.value.toUpperCase(),
          exclude: sourceState.exclude,
        };
      },
    });
    expect(adapter.state.exclude).toBe(true);

    source.setExclude(false);
    expect(adapter.state.exclude).toBe(false);
  });

  test('When subscribeToState() is called, state updates are emitted to the subscriber.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new ExcludableAdapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): ExcludableAdaptFnReturnType<string> => {
        return {
          value: sourceState.value.toUpperCase(),
          exclude: sourceState.exclude,
        };
      },
    });
    const updatedValue = 'test';
    adapter.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: updatedValue.toUpperCase(),
        validity: Validity.Valid,
        exclude: false,
      });
    });
    source.setValue(updatedValue);
  });
});
