import { describe, test, expect } from 'vitest';
import {
  DefaultAdapterFactory,
  Field,
  DefaultAdapter,
  ExcludableField,
  DefaultExcludableAdapter,
  StateManager,
  Validity,
  type FormChild,
  type FormChildState,
  type Excludable,
  type ExcludableState,
} from '../../../model';
import type { Subscription } from 'rxjs';

describe('DefaultAdapterFactory', () => {
  test(`When createDefaultAdapters() is called, it returns default adapters for 
  all non-transient, non-excludable fields.`, () => {
    const fields = [
      new Field({ name: 'firstName', defaultValue: 'Johann' }),
      new Field({ name: 'middleName', defaultValue: 'Sebastian' }),
      new Field({ name: 'lastName', defaultValue: 'Bach' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      fields,
      autoTrim: false,
    });
    expect(defaultAdapters.length).toEqual(fields.length);
    for (let i = 0; i < defaultAdapters.length; i++) {
      const adapter = defaultAdapters[i];
      const field = fields[i];
      expect(adapter).toBeInstanceOf(DefaultAdapter);
      expect(adapter).not.toBeInstanceOf(DefaultExcludableAdapter);
      expect(adapter.name).toEqual(field.name);
      expect(adapter.state.value).toEqual(field.state.value);
    }
  });

  test(`When createDefaultAdapters() is called, it returns default excludable 
  adapters for all non-transient, excludable fields.`, () => {
    const fields = [
      new ExcludableField({ name: 'workEmail', defaultValue: '' }),
      new ExcludableField({ name: 'workPhone', defaultValue: '' }),
      new ExcludableField({ name: 'homePhone', defaultValue: '' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      fields,
      autoTrim: false,
    });
    expect(defaultAdapters.length).toEqual(fields.length);
    for (let i = 0; i < defaultAdapters.length; i++) {
      const adapter = defaultAdapters[i];
      const field = fields[i];
      expect(adapter).toBeInstanceOf(DefaultExcludableAdapter);
      expect(adapter.name).toEqual(field.name);
      expect(adapter.state.value).toEqual(field.state.value);
    }
  });

  test(`When createDefaultAdapters() is called, it returns default adapters for 
  all fields that do not implement Transient, PossiblyTransient or 
  Excludable.`, () => {
    class ReadonlyField<T extends string, V> implements FormChild<T, V> {
      public readonly name: T;
      private stateManager: StateManager<FormChildState<V>>;

      public get state(): FormChildState<V> {
        return this.stateManager.state;
      }

      public constructor(name: T, value: V) {
        this.name = name;
        this.stateManager = new StateManager<FormChildState<V>>({
          value,
          validity: Validity.Valid,
        });
      }

      public subscribeToState(
        cb: (state: FormChildState<V>) => void,
      ): Subscription {
        return this.stateManager.subscribeToState(cb);
      }
    }

    const fields = [new ReadonlyField('testField', 'test')] as const;

    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      fields,
      autoTrim: false,
    });

    expect(defaultAdapters[0]).toBeInstanceOf(DefaultAdapter);
    expect(defaultAdapters[0]).not.toBeInstanceOf(DefaultExcludableAdapter);
    expect(defaultAdapters[0].name).toEqual(fields[0].name);
    expect(defaultAdapters[0].state.value).toEqual(fields[0].state.value);
  });

  test(`When createDefaultAdapters() is called, it returns default adapters for 
  all fields that implement Excludable and do not implement Transient or 
  PossiblyTransient.`, () => {
    class ExcludableNeverTransientField<T extends string, V>
      implements FormChild<T, V>, Excludable
    {
      public readonly name: T;
      private stateManager: StateManager<FormChildState<V> & ExcludableState>;

      public get state(): FormChildState<V> & ExcludableState {
        return this.stateManager.state;
      }

      public constructor(name: T, value: V) {
        this.name = name;
        this.stateManager = new StateManager<
          FormChildState<V> & ExcludableState
        >({
          value,
          validity: Validity.Valid,
          exclude: false,
        });
      }

      public subscribeToState(
        cb: (state: FormChildState<V> & ExcludableState) => void,
      ): Subscription {
        return this.stateManager.subscribeToState(cb);
      }
    }

    const fields = [
      new ExcludableNeverTransientField('testField', 'test'),
    ] as const;

    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      fields,
      autoTrim: false,
    });

    expect(defaultAdapters[0]).toBeInstanceOf(DefaultExcludableAdapter);
    expect(defaultAdapters[0].name).toEqual(fields[0].name);
    expect(defaultAdapters[0].state.value).toEqual(fields[0].state.value);
  });

  test(`When createDefaultAdapters() is called, it does not return adapters for 
  any transient fields.`, () => {
    const fields = [
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
      fields,
      autoTrim: false,
    });
    const nonTransientFormElements = fields.filter(
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

  test(`When createDefaultAdapters() is called with an autoTrim property set to 
  false, it does not apply auto-trim to any string-type fields.`, () => {
    const fields = [
      new Field({ name: 'firstName', defaultValue: ' ' }),
      new ExcludableField({ name: 'previousAddress', defaultValue: ' ' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      fields,
      autoTrim: false,
    });
    expect(defaultAdapters[0].state.value).toBe(' ');
    expect(defaultAdapters[1].state.value).toBe(' ');
  });

  test(`When createDefaultAdapters() is called with an autoTrim property set to 
  true, it applies auto-trim to all string-type fields.`, () => {
    const fields = [
      new Field({ name: 'firstName', defaultValue: ' ' }),
      new ExcludableField({ name: 'previousAddress', defaultValue: ' ' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      fields,
      autoTrim: true,
    });
    expect(defaultAdapters[0].state.value).toBe('');
    expect(defaultAdapters[1].state.value).toBe('');
  });

  test(`When createDefaultAdapters() is called with autoTrim.include, it applies 
  auto-trim to all string-type fields listed in that array.`, () => {
    const fields = [
      new Field({ name: 'included', defaultValue: ' ' }),
      new Field({ name: 'excluded', defaultValue: ' ' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      fields,
      autoTrim: { include: ['included'] },
    });
    expect(defaultAdapters[0].state.value).toBe('');
    expect(defaultAdapters[1].state.value).toBe(' ');
  });

  test(`When createDefaultAdapters() is called with autoTrim.exclude, it applies 
  auto-trim to all string-type fields NOT listed in that array.`, () => {
    const fields = [
      new Field({ name: 'included', defaultValue: ' ' }),
      new Field({ name: 'excluded', defaultValue: ' ' }),
    ];
    const defaultAdapters = DefaultAdapterFactory.createDefaultAdapters({
      fields,
      autoTrim: { exclude: ['excluded'] },
    });
    expect(defaultAdapters[0].state.value).toBe('');
    expect(defaultAdapters[1].state.value).toBe(' ');
  });
});
