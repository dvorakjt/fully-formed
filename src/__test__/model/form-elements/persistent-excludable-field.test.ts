import { describe, test, expect, afterEach, vi } from 'vitest';
import {
  clearAllPersistentFormElements,
  createPersistenceKey,
  PersistentExcludableField,
} from '../../../model';

describe('PersistentExcludableField', () => {
  afterEach(clearAllPersistentFormElements);

  test(`If its state has not yet been stored in session storage, its value 
  property is set to the default.`, () => {
    const field = new PersistentExcludableField({
      name: 'middleName',
      key: 'middleName',
      defaultValue: '',
    });

    expect(field.state.value).toBe('');
  });

  test(`If its state has not yet been stored in session storage, its exclude 
  property is set to excludeByDefault.`, () => {
    const field = new PersistentExcludableField({
      name: 'middleName',
      key: 'middleName',
      defaultValue: '',
      excludeByDefault: true,
    });

    expect(field.state.exclude).toBe(true);
  });

  test(`If its state has been stored in session storage, its value property 
  is set to the value read from storage.`, () => {
    const key = 'middleName';
    const storedValue = 'Thomas';

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: storedValue, exclude: false }),
    );

    const field = new PersistentExcludableField({
      name: 'middleName',
      key: 'middleName',
      defaultValue: '',
    });

    expect(field.state.value).toBe(storedValue);
  });

  test(`If its state has been stored in session storage, its exclude property 
  is set to the value read from storage.`, () => {
    const key = 'middleName';
    const excludeByDefault = true;

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: '', exclude: !excludeByDefault }),
    );

    const field = new PersistentExcludableField({
      name: 'middleName',
      key: 'middleName',
      defaultValue: '',
      excludeByDefault,
    });

    expect(field.state.exclude).toBe(!excludeByDefault);
  });

  test(`When its value property is updated, the value in session storage is
  updated.`, () => {
    const key = 'middleName';

    const field = new PersistentExcludableField({
      name: 'middleName',
      key: 'middleName',
      defaultValue: '',
    });

    const updatedValue = 'Thelonious';
    field.setValue(updatedValue);

    expect(
      JSON.parse(sessionStorage.getItem(createPersistenceKey(key))!).value,
    ).toBe(updatedValue);
  });

  test(`When its exclude property is updated, the value in session storage is
  updated.`, () => {
    const key = 'middleName';
    const excludeByDefault = true;

    const field = new PersistentExcludableField({
      name: 'middleName',
      key: 'middleName',
      defaultValue: '',
      excludeByDefault,
    });

    field.setExclude(!excludeByDefault);

    expect(
      JSON.parse(sessionStorage.getItem(createPersistenceKey(key))!).exclude,
    ).toBe(!excludeByDefault);
  });

  test(`When reset() is called, its value property is set to the default,
  not the value stored in session storage.`, () => {
    const key = 'middleName';
    const defaultValue = '';
    const storedValue = 'Thomas';

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: storedValue, exclude: false }),
    );

    const field = new PersistentExcludableField({
      name: 'middleName',
      key,
      defaultValue,
    });

    expect(field.state.value).toBe(storedValue);

    field.reset();
    expect(field.state.value).toBe(defaultValue);
  });

  test(`When reset() is called, its exclude property is set to excludeByDefault,
  not the value stored in session storage.`, () => {
    const key = 'middleName';
    const excludeByDefault = false;

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: '', exclude: !excludeByDefault }),
    );

    const field = new PersistentExcludableField({
      name: 'middleName',
      key,
      defaultValue: '',
      excludeByDefault,
    });

    expect(field.state.exclude).toBe(!excludeByDefault);

    field.reset();
    expect(field.state.exclude).toBe(excludeByDefault);
  });

  test(`sessionStorage is not accessed in the constructor if window is 
  undefined.`, () => {
    const temp = window;
    window = undefined as any;
    /* 
      Here, the prototype of sessionStorage must be spied on to actually 
      check whether or not the getItem method was called because of the way
      the storage APIs are implemented in jsdom.
    */
    const spy = vi.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem');

    new PersistentExcludableField({
      name: 'firstName',
      key: 'firstName',
      defaultValue: 'John',
    });

    expect(spy).not.toHaveBeenCalled();
    window = temp;
    spy.mockRestore();
  });
});
