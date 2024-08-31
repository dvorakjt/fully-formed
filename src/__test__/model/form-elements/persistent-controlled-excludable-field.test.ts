import { describe, test, expect, afterEach } from 'vitest';
import {
  clearAllPersistentFormElements,
  createPersistenceKey,
  PersistentControlledExcludableField,
  ExcludableField,
} from '../../../model';

describe('PersistentControlledExcludableField', () => {
  afterEach(clearAllPersistentFormElements);

  test(`If its state has not yet been stored in session storage, its value 
  property is set to the result of the initFn.`, () => {
    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Sally',
    });

    const middleInitial = new PersistentControlledExcludableField({
      name: 'middleInitial',
      key: 'middleInitial',
      controller: middleName,
      initFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
      controlFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
    });

    expect(middleInitial.state.value).toBe('S');
  });

  test(`If its state has not yet been stored in session storage, its exclude 
  property is set to the result of the initFn.`, () => {
    const excludeByDefault = true;

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Sally',
      excludeByDefault,
    });

    const middleInitial = new PersistentControlledExcludableField({
      name: 'middleInitial',
      key: 'middleInitial',
      controller: middleName,
      initFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
      controlFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
    });

    expect(middleInitial.state.exclude).toBe(excludeByDefault);
  });

  test(`If its state has been stored in session storage, its value property 
  is set to the value read from storage.`, () => {
    const key = 'middleInitial';
    const storedValue = 'W';

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: storedValue, exclude: false }),
    );

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Sally',
    });

    const middleInitial = new PersistentControlledExcludableField({
      name: 'middleInitial',
      key: 'middleInitial',
      controller: middleName,
      initFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
      controlFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
    });

    expect(middleInitial.state.value).toBe(storedValue);
  });

  test(`If its state has been stored in session storage, its exclude property
  is set to the value read from storage.`, () => {
    const key = 'middleInitial';
    const excludeByDefault = false;

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: '', exclude: !excludeByDefault }),
    );

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Sally',
      excludeByDefault,
    });

    const middleInitial = new PersistentControlledExcludableField({
      name: 'middleInitial',
      key: 'middleInitial',
      controller: middleName,
      initFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
      controlFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
    });

    expect(middleInitial.state.exclude).toBe(!excludeByDefault);
  });

  test(`When its value property is updated, the value in session storage is
  updated.`, () => {
    const key = 'middleInitial';

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Sally',
    });

    new PersistentControlledExcludableField({
      name: 'middleInitial',
      key,
      controller: middleName,
      initFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
      controlFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
    });

    middleName.setValue('Nadia');
    expect(
      JSON.parse(sessionStorage.getItem(createPersistenceKey(key))!).value,
    ).toBe('N');
  });

  test(`When its exclude property is updated, the value in session storage is
  updated.`, () => {
    const key = 'middleInitial';
    const excludeByDefault = false;

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Sally',
      excludeByDefault,
    });

    new PersistentControlledExcludableField({
      name: 'middleInitial',
      key,
      controller: middleName,
      initFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
      controlFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
    });

    middleName.setExclude(!excludeByDefault);
    expect(
      JSON.parse(sessionStorage.getItem(createPersistenceKey(key))!).exclude,
    ).toBe(!excludeByDefault);
  });

  test(`When reset() is called, its value property is set to the result of the
  initFn, not the value stored in session storage.`, () => {
    const key = 'middleInitial';
    const storedValue = 'W';

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: storedValue, exclude: false }),
    );

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Sally',
    });

    const middleInitial = new PersistentControlledExcludableField({
      name: 'middleInitial',
      key: 'middleInitial',
      controller: middleName,
      initFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
      controlFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
    });

    expect(middleInitial.state.value).toBe(storedValue);

    middleInitial.reset();
    expect(middleInitial.state.value).toBe('S');
  });

  test(`When reset() is called, its exclude property is set to the result of the
  initFn, not the value stored in session storage.`, () => {
    const key = 'middleInitial';
    const excludeByDefault = false;

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ value: '', exclude: !excludeByDefault }),
    );

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Sally',
      excludeByDefault,
    });

    const middleInitial = new PersistentControlledExcludableField({
      name: 'middleInitial',
      key: 'middleInitial',
      controller: middleName,
      initFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
      controlFn: (controllerState): { value: string; exclude: boolean } => {
        return {
          value: controllerState.value ? controllerState.value[0] : '',
          exclude: controllerState.exclude,
        };
      },
    });

    expect(middleInitial.state.exclude).toBe(!excludeByDefault);

    middleInitial.reset();
    expect(middleInitial.state.exclude).toBe(excludeByDefault);
  });
});
