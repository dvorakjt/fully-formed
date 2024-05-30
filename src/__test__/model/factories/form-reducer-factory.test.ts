import { describe, test, expect } from 'vitest';
import {
  Adapter,
  ExcludableField,
  Field,
  FormReducerFactory,
  Group,
  StateManager,
  StringValidators,
  Validity,
  type FormChild,
  type FormChildState,
  type StateWithChanges,
} from '../../../model';
import type { Subscription } from 'rxjs';

describe('FormReducerFactory', () => {
  test(`It returns a FormReducer whose value contains the values of all 
  non-transient fields.`, () => {
    const fields = [
      new Field({ name: 'firstName', defaultValue: 'Carl' }),
      new ExcludableField({ name: 'middleName', defaultValue: 'Maria' }),
      new Field({ name: 'lastName', defaultValue: 'von Weber' }),
    ] as const;

    type Members = {
      fields: typeof fields;
      groups: [];
      adapters: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Members>({
      fields,
      adapters: [],
      groups: [],
      autoTrim: false,
    });

    expect(reducer.state.value).toStrictEqual({
      firstName: 'Carl',
      middleName: 'Maria',
      lastName: 'von Weber',
    });
  });

  test(`It returns a FormReducer whose value contains the values of all 
  fields that do not implement Transient or PossiblyTransient.`, () => {
    class ReadonlyField<T extends string, V> implements FormChild<T, V> {
      public readonly name: T;
      private stateManager: StateManager<FormChildState<V>>;

      public get state(): StateWithChanges<FormChildState<V>> {
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
        cb: (state: StateWithChanges<FormChildState<V>>) => void,
      ): Subscription {
        return this.stateManager.subscribeToState(cb);
      }
    }

    const fields = [new ReadonlyField('testField', 'test')] as const;

    const reducer = FormReducerFactory.createFormReducer({
      fields,
      adapters: [],
      groups: [],
      autoTrim: false,
    });

    expect(reducer.state.value).toStrictEqual({
      testField: 'test',
    });
  });

  test(`It returns a FormReducer whose value does NOT contain the values of any 
  transient fields.`, () => {
    const fields = [
      new Field({ name: 'transientField', defaultValue: '', transient: true }),
      new ExcludableField({
        name: 'transientExcludableField',
        defaultValue: '',
        transient: true,
      }),
    ] as const;

    type Members = {
      fields: typeof fields;
      groups: [];
      adapters: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Members>({
      fields,
      adapters: [],
      groups: [],
      autoTrim: false,
    });
    expect(reducer.state.value).toStrictEqual({});
  });

  test(`It returns a FormReducer whose value contains the values of any custom 
  adapters.`, () => {
    const fields = [
      new Field({ name: 'birthYear', defaultValue: '1990', transient: true }),
    ] as const;

    const adapters = [
      new Adapter({
        name: 'age',
        source: fields[0],
        adaptFn: ({ value }): number => {
          return 2024 - Number(value);
        },
      }),
    ] as const;

    type Members = {
      fields: typeof fields;
      adapters: typeof adapters;
      groups: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Members>({
      fields,
      adapters: adapters,
      groups: [],
      autoTrim: false,
    });
    expect(reducer.state.value).toStrictEqual({
      age: 34,
    });
  });

  test(`It returns a FormReducer whose validity is determined by its 
  fields.`, () => {
    const fields = [
      new Field({
        name: 'requiredField',
        defaultValue: '',
        validators: [StringValidators.required()],
      }),
    ] as const;

    type Members = {
      fields: typeof fields;
      adapters: [];
      groups: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Members>({
      fields,
      adapters: [],
      groups: [],
      autoTrim: false,
    });
    expect(reducer.state.validity).toBe(Validity.Invalid);
  });

  test(`It returns a FormReducer whose validity is determined by its 
  groups.`, () => {
    const fields = [
      new Field({ name: 'password', defaultValue: 'password' }),
      new Field({ name: 'confirmPassword', defaultValue: '', transient: true }),
    ] as const;

    const groups = [
      new Group({
        name: 'passwordGroup',
        members: fields,
        validatorTemplates: [
          {
            predicate: ({ password, confirmPassword }): boolean => {
              return password === confirmPassword;
            },
          },
        ],
      }),
    ] as const;

    type Members = {
      fields: typeof fields;
      adapters: [];
      groups: typeof groups;
    };

    const reducer = FormReducerFactory.createFormReducer<Members>({
      fields,
      adapters: [],
      groups,
      autoTrim: false,
    });
    expect(reducer.state.validity).toBe(Validity.Invalid);
  });

  test(`It returns a FormReducer that trims string fields depending on the value 
  of the autoTrim property of the params passed to its constructor.`, () => {
    const fields = [
      new Field({ name: 'autoTrimmed', defaultValue: ' ' }),
      new Field({ name: 'notAutoTrimmed', defaultValue: ' ' }),
    ] as const;

    type Members = {
      fields: typeof fields;
      adapters: [];
      groups: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Members>({
      fields,
      adapters: [],
      groups: [],
      autoTrim: {
        include: ['autoTrimmed'],
      },
    });

    expect(reducer.state.value.autoTrimmed).toBe('');
    expect(reducer.state.value.notAutoTrimmed).toBe(' ');
  });
});
