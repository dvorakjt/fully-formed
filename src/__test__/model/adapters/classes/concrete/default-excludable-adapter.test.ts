import { describe, test, expect } from 'vitest';
import {
  ExcludableField,
  StringValidators,
  Validity,
} from '../../../../../model';
import { DefaultExcludableAdapter } from '../../../../../model/adapters/classes/concrete/default-excludable-adapter';

describe('DefaultExcludableAdapter', () => {
  test('Its name property matches that of its source.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
    });
    const adapter = new DefaultExcludableAdapter({
      source,
    });
    expect(adapter.name).toBe(source.name);
  });

  test('Its value defaults to the value of its source when no adaptFn is provided to its constructor.', () => {
    const sourceDefaultValue = 'test';
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new DefaultExcludableAdapter({
      source,
    });
    expect(adapter.state.value).toBe(sourceDefaultValue);
  });

  test('Its value defaults to the result of applying its adaptFn to the value of its source when one has been supplied to its constructor.', () => {
    const sourceDefaultValue = '   \n\t\r\n   ';
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new DefaultExcludableAdapter({
      source,
      adaptFn: (sourceValue): string => sourceValue.trim(),
    });
    expect(adapter.state.value).toBe('');
  });

  test('Its validity defaults to that of its source.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new DefaultExcludableAdapter({
      source,
    });
    expect(adapter.state.validity).toBe(Validity.Invalid);
  });

  test("The exclude property of its state defaults to the value of the exclude property of its source's state.", () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      excludeByDefault: true,
    });
    const adapter = new DefaultExcludableAdapter({
      source,
    });
    expect(adapter.state.exclude).toBe(true);
  });

  test('When the value of its source changes, its value is updated.', () => {
    const sourceDefaultValue = '';
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new DefaultExcludableAdapter({
      source,
    });
    expect(adapter.state.value).toBe(sourceDefaultValue);
    const updatedValue = 'test';
    source.setValue(updatedValue);
    expect(adapter.state.value).toBe(updatedValue);
  });

  test('When the validity of its source changes, its validity is updated.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new DefaultExcludableAdapter({
      source,
    });
    expect(adapter.state.validity).toBe(Validity.Invalid);
    source.setValue('test');
    expect(adapter.state.validity).toBe(Validity.Valid);
  });

  test("When the exclude property of its source's state changes, its own exclude property is updated.", () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '',
      excludeByDefault: true,
    });
    const adapter = new DefaultExcludableAdapter({
      source,
    });
    expect(adapter.state.exclude).toBe(true);
    source.setExclude(false);
    expect(adapter.state.exclude).toBe(false);
  });

  test('When subscribeToState() is called, state updates are emitted to the subscriber.', () => {
    const source = new ExcludableField({
      name: 'testField',
      defaultValue: '  ',
      validators: [StringValidators.required({ trimBeforeValidation: true })],
    });
    const adapter = new DefaultExcludableAdapter({
      source,
      adaptFn: (sourceValue): string => sourceValue.trim(),
    });
    const updatedValue = '   test   ';
    adapter.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: updatedValue.trim(),
        validity: Validity.Valid,
        exclude: false,
      });
    });
    source.setValue(updatedValue);
  });
});
