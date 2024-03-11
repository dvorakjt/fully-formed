import { describe, test, expect } from 'vitest';
import {
  Adapter,
  ExcludableField,
  Field,
  FormReducerFactory,
  Group,
  StringValidators,
  Validity,
} from '../../../../../model';

describe('FormReducer', () => {
  test('It returns a FormReducer whose value contains all non-transient form elements.', () => {
    const formElements = [
      new Field({ name: 'firstName', defaultValue: 'Carl' }),
      new ExcludableField({ name: 'middleName', defaultValue: 'Maria' }),
      new Field({ name: 'lastName', defaultValue: 'von Weber' }),
    ] as const;

    type Constituents = {
      formElements: typeof formElements;
      adapters: [];
      derivedValues: [];
      groups: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: [],
      groups: [],
      autoTrim: false,
    });

    expect(reducer.state.value).toStrictEqual({
      firstName: 'Carl',
      middleName: 'Maria',
      lastName: 'von Weber',
    });
  });

  test('It returns a FormReducer whose value contains no transient form elements.', () => {
    const formElements = [
      new Field({ name: 'transientField', defaultValue: '', transient: true }),
      new ExcludableField({
        name: 'transientExcludableField',
        defaultValue: '',
        transient: true,
      }),
    ] as const;

    type Constituents = {
      formElements: typeof formElements;
      adapters: [];
      groups: [];
      derivedValues: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: [],
      groups: [],
      autoTrim: false,
    });
    expect(reducer.state.value).toStrictEqual({});
  });

  test('It returns a FormReducer whose value contains the values of any custom adapters.', () => {
    const formElements = [
      new Field({ name: 'birthYear', defaultValue: '1990', transient: true }),
    ] as const;

    const adapters = [
      new Adapter({
        name: 'age',
        source: formElements[0],
        adaptFn: ({ value }): number => {
          return 2024 - Number(value);
        },
      }),
    ] as const;

    type Constituents = {
      formElements: typeof formElements;
      adapters: typeof adapters;
      groups: [];
      derivedValues: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: adapters,
      groups: [],
      autoTrim: false,
    });
    expect(reducer.state.value).toStrictEqual({
      age: 34,
    });
  });

  test('It returns a FormReducer whose validity is determined by its form elements.', () => {
    const formElements = [
      new Field({
        name: 'requiredField',
        defaultValue: '',
        validators: [StringValidators.required()],
      }),
    ] as const;

    type Constituents = {
      formElements: typeof formElements;
      adapters: [];
      groups: [];
      derivedValues: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: [],
      groups: [],
      autoTrim: false,
    });
    expect(reducer.state.validity).toBe(Validity.Invalid);
  });

  test('It returns a FormReducer whose validity is determined by its groups.', () => {
    const formElements = [
      new Field({ name: 'password', defaultValue: 'password' }),
      new Field({ name: 'confirmPassword', defaultValue: '', transient: true }),
    ] as const;
    const groups = [
      new Group({
        name: 'passwordGroup',
        members: formElements,
        validatorTemplates: [
          {
            predicate: ({ password, confirmPassword }): boolean => {
              return password === confirmPassword;
            },
          },
        ],
      }),
    ] as const;
    type Constituents = {
      formElements: typeof formElements;
      adapters: [];
      groups: typeof groups;
      derivedValues: [];
    };
    const reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: [],
      groups,
      autoTrim: false,
    });
    expect(reducer.state.validity).toBe(Validity.Invalid);
  });

  test('It returns a FormReducer that trims string fields depending on the value of autoTrim passed into its constructor.', () => {
    const formElements = [
      new Field({ name: 'autoTrimmed', defaultValue: ' ' }),
      new Field({ name: 'notAutoTrimmed', defaultValue: ' ' }),
    ] as const;

    type Constituents = {
      formElements: typeof formElements;
      adapters: [];
      groups: [];
      derivedValues: [];
    };

    const reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: [],
      groups: [],
      autoTrim: {
        include: ['autoTrimmed'],
      },
    });

    expect(reducer.state.value.autoTrimmed).toBe('');
    expect(reducer.state.value.notAutoTrimmed).toBe(' ');
  });
});
