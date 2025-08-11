import { describe, test, expect, afterEach, vi } from 'vitest';
import {
  clearAllPersistentFormElements,
  createPersistenceKey,
  Field,
  PersistentControlledField,
} from '../../../model';

describe('PersistentControlledField', () => {
  afterEach(clearAllPersistentFormElements);

  test(`If its state has not yet been stored in session storage, its value 
  property is set to the result of the initFn.`, () => {
    const controller = new Field({
      name: 'firstName',
      defaultValue: 'John',
    });

    const field = new PersistentControlledField({
      name: 'firstInitial',
      key: 'firstInitial',
      controller,
      initFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
      controlFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
    });

    expect(field.state.value).toBe('J');
  });

  test(`If its state has been stored in session storage, its value property 
  is set to the value read from storage.`, () => {
    const key = 'firstInitial';
    const storedValue = 'X';

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: storedValue }),
    );

    const controller = new Field({
      name: 'firstName',
      defaultValue: 'John',
    });

    const field = new PersistentControlledField({
      name: 'firstInitial',
      key,
      controller,
      initFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
      controlFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
    });

    expect(field.state.value).toBe(storedValue);
  });

  test(`When its value property is updated, the value in session storage is 
  updated.`, () => {
    const key = 'firstInitial';

    const controller = new Field({
      name: 'firstName',
      defaultValue: 'John',
    });

    new PersistentControlledField({
      name: 'firstInitial',
      key,
      controller,
      initFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
      controlFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
    });

    controller.setValue('Xavier');

    expect(
      JSON.parse(sessionStorage.getItem(createPersistenceKey(key))!).value,
    ).toBe('X');
  });

  test(`When reset() is called, its value property is set to the result of the 
  initFn, not the value stored in session storage.`, () => {
    const key = 'firstInitial';
    const storedValue = 'X';

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: storedValue }),
    );

    const controller = new Field({
      name: 'firstName',
      defaultValue: 'John',
    });

    const field = new PersistentControlledField({
      name: 'firstInitial',
      key,
      controller,
      initFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
      controlFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
    });

    expect(field.state.value).toBe(storedValue);

    field.reset();
    expect(field.state.value).toBe('J');
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

    const controller = new Field({
      name: 'firstName',
      defaultValue: 'John',
    });

    new PersistentControlledField({
      name: 'firstInitial',
      key: 'firstInitial',
      controller,
      initFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
      controlFn: (controllerState): string => {
        return controllerState.value ? controllerState.value[0] : '';
      },
    });

    expect(spy).not.toHaveBeenCalled();
    window = temp;
    spy.mockRestore();
  });
});
