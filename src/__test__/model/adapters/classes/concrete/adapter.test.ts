import { describe, test, expect } from 'vitest';
import {
  Field,
  Adapter,
  StringValidators,
  Validity,
} from '../../../../../model';

describe('Adapter', () => {
  test('Its value defaults to the result of applying its adaptFn to the value of its source.', () => {
    const sourceDefaultValue = 'test';
    const source = new Field({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new Adapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): string => sourceState.value.toUpperCase(),
    });
    expect(adapter.state.value).toBe(sourceDefaultValue.toUpperCase());
  });

  test('Its validity defaults to that of its source.', () => {
    const source = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new Adapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): string => sourceState.value,
    });
    expect(adapter.state.validity).toBe(Validity.Invalid);
  });

  test('When the value of its source changes, its value is updated.', () => {
    const sourceDefaultValue = '';
    const source = new Field({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new Adapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): string => sourceState.value.toUpperCase(),
    });
    expect(adapter.state.value).toBe(sourceDefaultValue.toUpperCase());

    const updatedValue = 'test';
    source.setValue(updatedValue);
    expect(adapter.state.value).toBe(updatedValue.toUpperCase());
  });

  test('When the validity of its source changes, its validity is updated.', () => {
    const source = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new Adapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): string => sourceState.value.toUpperCase(),
    });
    expect(adapter.state.validity).toBe(Validity.Invalid);

    source.setValue('test');
    expect(adapter.state.validity).toBe(Validity.Valid);
  });

  test('When subscribeToState() is called, state updates are emitted to the subscriber.', () => {
    const source = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new Adapter({
      name: 'testAdapter',
      source,
      adaptFn: (sourceState): string => sourceState.value.toUpperCase(),
    });
    const updatedValue = 'test';
    adapter.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: updatedValue.toUpperCase(),
        validity: Validity.Valid,
      });
    });
    source.setValue(updatedValue);
  });
});
