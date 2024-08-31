import { describe, test, expect, afterEach } from 'vitest';
import {
  clearAllPersistentFormElements,
  createPersistenceKey,
  PersistentField,
} from '../../../model';

describe('PersistentField', () => {
  afterEach(clearAllPersistentFormElements);

  test(`If its state has not yet been stored in session storage, its value 
  property is set to the default.`, () => {
    const field = new PersistentField({
      name: 'firstName',
      key: 'firstName',
      defaultValue: '',
    });

    expect(field.state.value).toBe('');
  });

  test(`If its state has been stored in session storage, its value property 
  is set to the value read from storage.`, () => {
    const key = 'firstName';
    const storedValue = 'John';

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: storedValue }),
    );

    const field = new PersistentField({
      name: 'firstName',
      key,
      defaultValue: '',
    });

    expect(field.state.value).toBe(storedValue);
  });

  test(`When its value property is updated, the value in session storage is 
  updated.`, () => {
    const key = 'firstName';

    const field = new PersistentField({
      name: 'firstName',
      key,
      defaultValue: '',
    });

    const updatedValue = 'John';
    field.setValue(updatedValue);
    expect(
      JSON.parse(sessionStorage.getItem(createPersistenceKey(key))!).value,
    ).toBe(updatedValue);
  });

  test(`When reset() is called, its value property is set to the default,
  not the value stored in session storage.`, () => {
    const key = 'firstName';
    const storedValue = 'John';

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: storedValue }),
    );

    const field = new PersistentField({
      name: 'firstName',
      key,
      defaultValue: '',
    });

    expect(field.state.value).toBe(storedValue);

    field.reset();
    expect(field.state.value).toBe('');
  });
});
