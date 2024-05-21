import { describe, test, expect } from 'vitest';
import {
  Field,
  DefaultAdapter,
  StringValidators,
  Validity,
} from '../../../model';

describe('DefaultAdapter', () => {
  test('Its name property matches that of its source.', () => {
    const source = new Field({
      name: 'testField',
      defaultValue: '',
    });
    const adapter = new DefaultAdapter({
      source,
    });
    expect(adapter.name).toBe(source.name);
  });

  test(`Its value is initialized to that of its source when no adapt function 
  was provided.`, () => {
    const sourceDefaultValue = 'test';
    const source = new Field({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new DefaultAdapter({
      source,
    });
    expect(adapter.state.value).toBe(sourceDefaultValue);
  });

  test(`When it received an adapt function, its value is initialized to the 
  result of calling that function with the state of it source.`, () => {
    const sourceDefaultValue = '   \n\t\r\n   ';
    const source = new Field({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new DefaultAdapter({
      source,
      adaptFn: (sourceValue): string => sourceValue.trim(),
    });
    expect(adapter.state.value).toBe('');
  });

  test('Its validity matches that of its source.', () => {
    const source = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new DefaultAdapter({
      source,
    });
    expect(adapter.state.validity).toBe(Validity.Invalid);
  });

  test('When the value of its source changes, its value is updated.', () => {
    const sourceDefaultValue = '';
    const source = new Field({
      name: 'testField',
      defaultValue: sourceDefaultValue,
    });
    const adapter = new DefaultAdapter({
      source,
    });
    expect(adapter.state.value).toBe(sourceDefaultValue);

    const updatedValue = 'test';
    source.setValue(updatedValue);
    expect(adapter.state.value).toBe(updatedValue);
  });

  test(`When the validity of its source changes, its validity is 
  updated.`, () => {
    const source = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const adapter = new DefaultAdapter({
      source,
    });
    expect(adapter.state.validity).toBe(Validity.Invalid);

    source.setValue('test');
    expect(adapter.state.validity).toBe(Validity.Valid);
  });

  test(`When subscribeToState() is called, state updates are emitted to the 
  subscriber.`, () => {
    const source = new Field({
      name: 'testField',
      defaultValue: '  ',
      validators: [StringValidators.required({ trimBeforeValidation: true })],
    });
    const adapter = new DefaultAdapter({
      source,
      adaptFn: (sourceValue): string => sourceValue.trim(),
    });
    const updatedValue = '   test   ';
    adapter.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: updatedValue.trim(),
        validity: Validity.Valid,
      });
    });
    source.setValue(updatedValue);
  });
});
