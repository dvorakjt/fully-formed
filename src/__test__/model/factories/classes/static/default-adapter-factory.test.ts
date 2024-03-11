import { describe, test, expect } from 'vitest';
import {
  DefaultAdapterFactory,
  Field,
  DefaultAdapter,
  ExcludableField,
  DefaultExcludableAdapter,
} from '../../../../../model';

describe('DefaultAdapterFactory', () => {
  test('When createDefaultAdapters() is called, it returns default adapters for all non-transient, non-excludable form elements.', () => {
    const formElements = [
      new Field({ name: 'firstName', defaultValue: 'Johann' }),
      new Field({ name: 'middleName', defaultValue: 'Sebastian' }),
      new Field({ name: 'lastName', defaultValue: 'Bach' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      formElements,
      autoTrim: false,
    });
    expect(defaultAdapters.length).toEqual(formElements.length);
    for (let i = 0; i < defaultAdapters.length; i++) {
      const adapter = defaultAdapters[i];
      const formElement = formElements[i];
      expect(adapter).toBeInstanceOf(DefaultAdapter);
      expect(adapter).not.toBeInstanceOf(DefaultExcludableAdapter);
      expect(adapter.name).toEqual(formElement.name);
      expect(adapter.state.value).toEqual(formElement.state.value);
    }
  });

  test('When createDefaultAdapters() is called, it returns default excludable adapters for all non-transient, excludable form elements.', () => {
    const formElements = [
      new ExcludableField({ name: 'workEmail', defaultValue: '' }),
      new ExcludableField({ name: 'workPhone', defaultValue: '' }),
      new ExcludableField({ name: 'homePhone', defaultValue: '' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      formElements,
      autoTrim: false,
    });
    expect(defaultAdapters.length).toEqual(formElements.length);
    for (let i = 0; i < defaultAdapters.length; i++) {
      const adapter = defaultAdapters[i];
      const formElement = formElements[i];
      expect(adapter).toBeInstanceOf(DefaultExcludableAdapter);
      expect(adapter.name).toEqual(formElement.name);
      expect(adapter.state.value).toEqual(formElement.state.value);
    }
  });

  test('When createDefaultAdapters() is called, it does not return adapters for any transient form elements.', () => {
    const formElements = [
      new Field({ name: 'email', defaultValue: '' }),
      new Field({ name: 'confirmEmail', defaultValue: '', transient: true }),
      new Field({ name: 'password', defaultValue: '' }),
      new Field({ name: 'confirmPassword', defaultValue: '', transient: true }),
      new ExcludableField({
        name: 'previousAddress',
        defaultValue: '',
        transient: true,
      }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      formElements,
      autoTrim: false,
    });
    const nonTransientFormElements = formElements.filter(
      formElement => !formElement.transient,
    );
    expect(defaultAdapters.length).toEqual(nonTransientFormElements.length);
    for (let i = 0; i < defaultAdapters.length; i++) {
      const adapter = defaultAdapters[i];
      const formElement = nonTransientFormElements[i];
      expect(adapter).toBeInstanceOf(DefaultAdapter);
      expect(adapter.name).toBe(formElement.name);
      expect(adapter.state.value).toBe(formElement.state.value);
    }
  });

  test('When createDefaultAdapters() is called with an autoTrim property set to false, it does not apply auto-trim to any string-type fields.', () => {
    const formElements = [
      new Field({ name: 'firstName', defaultValue: ' ' }),
      new ExcludableField({ name: 'previousAddress', defaultValue: ' ' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      formElements,
      autoTrim: false,
    });
    expect(defaultAdapters[0].state.value).toBe(' ');
    expect(defaultAdapters[1].state.value).toBe(' ');
  });

  test('When createDefaultAdapters() is called with an autoTrim property set to true, it applies auto-trim to all string-type fields.', () => {
    const formElements = [
      new Field({ name: 'firstName', defaultValue: ' ' }),
      new ExcludableField({ name: 'previousAddress', defaultValue: ' ' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      formElements,
      autoTrim: true,
    });
    expect(defaultAdapters[0].state.value).toBe('');
    expect(defaultAdapters[1].state.value).toBe('');
  });

  test('When createDefaultAdapters() is called with an autoTrim property with an include property, it applies auto-trim to all string-type fields included in the include field of autoTrim.', () => {
    const formElements = [
      new Field({ name: 'included', defaultValue: ' ' }),
      new Field({ name: 'excluded', defaultValue: ' ' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      formElements,
      autoTrim: { include: ['included'] },
    });
    expect(defaultAdapters[0].state.value).toBe('');
    expect(defaultAdapters[1].state.value).toBe(' ');
  });

  test('When createDefaultAdapters() is called with an autoTrim property with an exclude property, it applies auto-trim to all string-type fields not included in the exclude field of autoTrim.', () => {
    const formElements = [
      new Field({ name: 'included', defaultValue: ' ' }),
      new Field({ name: 'excluded', defaultValue: ' ' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      formElements,
      autoTrim: { exclude: ['excluded'] },
    });
    expect(defaultAdapters[0].state.value).toBe('');
    expect(defaultAdapters[1].state.value).toBe(' ');
  });
});
