/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { describe, test, expect } from 'vitest';
import {
  Adapter,
  Group,
  Field,
  FormReducer,
  ExcludableField,
  StringValidators,
  Validity,
  AsyncValidator,
  ExcludableAdapter,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';

describe('FormReducer', () => {
  test('Its value contains the values of all non-transient fields and adapters.', () => {
    const firstName = new Field({
      name: 'firstName',
      defaultValue: 'Lili',
      transient: true,
    });

    const lastName = new Field({
      name: 'lastName',
      defaultValue: 'Boulanger',
      transient: true,
    });

    const occupation = new Field({
      name: 'occupation',
      defaultValue: 'composer',
    });

    const fullNameGroup = new Group({
      name: 'fullName',
      members: [firstName, lastName],
    });

    const fullNameAdapter = new Adapter({
      name: 'fullName',
      source: fullNameGroup,
      adaptFn: ({ value }): string => {
        return `${value.lastName}, ${value.firstName}`;
      },
    });

    type Members = {
      fields: [typeof firstName, typeof lastName, typeof occupation];
      adapters: [typeof fullNameAdapter];
      groups: [typeof fullNameGroup];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [fullNameAdapter, occupation],
      transientFields: [firstName, lastName],
      groups: [fullNameGroup],
    });

    expect(reducer.state.value).toStrictEqual({
      fullName: 'Boulanger, Lili',
      occupation: 'composer',
    });
  });

  test(`Its value does not contain the values of any excluded fields or 
  adapters.`, () => {
    const firstName = new Field({ name: 'firstName', defaultValue: 'Clara' });
    const lastName = new Field({ name: 'lastName', defaultValue: 'Schumann' });

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Josephine',
      excludeByDefault: true,
    });

    const middleInitial = new ExcludableAdapter({
      name: 'middleInitial',
      source: middleName,
      adaptFn: ({ value, exclude }) => {
        return {
          value: value.slice(0, 1).toUpperCase(),
          exclude,
        };
      },
    });

    type Members = {
      fields: [typeof firstName, typeof lastName, typeof middleName];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [
        firstName,
        lastName,
        middleName,
        middleInitial,
      ],
      transientFields: [],
      groups: [],
    });

    expect(reducer.state.value).toStrictEqual({
      firstName: 'Clara',
      lastName: 'Schumann',
    });
  });

  test(`Its validity is invalid if any included fields or adapters are 
  invalid.`, () => {
    const firstName = new Field({
      name: 'firstName',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const lastName = new Field({
      name: 'lastName',
      defaultValue: '',
      validators: [StringValidators.required()],
      transient: true,
    });

    const lastInitial = new Adapter({
      name: 'lastInitial',
      source: lastName,
      adaptFn: ({ value }) => value.slice(0, 1).toUpperCase(),
    });

    type Members = {
      fields: [typeof firstName, typeof lastName];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [firstName, lastInitial],
      transientFields: [],
      groups: [],
    });
    expect(reducer.state.validity).toBe(Validity.Invalid);
  });

  test(`Its validity is invalid if any included transient form elements are 
  invalid.`, () => {
    const password = new Field({ name: 'password', defaultValue: '' });
    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: '',
      transient: true,
      validators: [StringValidators.required()],
    });

    type Members = {
      fields: [typeof password, typeof confirmPassword];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [password],
      transientFields: [confirmPassword],
      groups: [],
    });

    expect(reducer.state.validity).toBe(Validity.Invalid);
  });

  test('Its validity is invalid if any groups are invalid.', () => {
    const primaryEmail = new Field({
      name: 'primaryEmail',
      defaultValue: 'user@example.com',
    });
    const secondaryEmail = new Field({
      name: 'secondaryEmail',
      defaultValue: 'user@example.com',
    });
    const emailAddresses = new Group({
      name: 'emailAddresses',
      members: [primaryEmail, secondaryEmail],
      validatorTemplates: [
        {
          predicate: ({ primaryEmail, secondaryEmail }): boolean => {
            return primaryEmail !== secondaryEmail;
          },
        },
      ],
    });
    type Members = {
      fields: [typeof primaryEmail, typeof secondaryEmail];
      adapters: [];
      groups: [typeof emailAddresses];
    };
    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [primaryEmail, secondaryEmail],
      transientFields: [],
      groups: [emailAddresses],
    });
    expect(reducer.state.validity).toBe(Validity.Invalid);
  });

  test(`Its validity is pending if all included non-transient fields, adapters, 
  transient fields, and groups are either valid or pending.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });

    const pendingField = new Field({
      name: 'pendingField',
      defaultValue: '',
      asyncValidators: [requiredAsync],
      delayAsyncValidatorExecution: 0,
    });

    const validTransientField = new Field({
      name: 'validTransientField',
      defaultValue: '',
      transient: true,
    });

    const validGroup = new Group({
      name: 'validGroup',
      members: [validTransientField],
    });

    type Members = {
      fields: [typeof pendingField, typeof validTransientField];
      adapters: [];
      groups: [typeof validGroup];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [pendingField],
      transientFields: [validTransientField],
      groups: [validGroup],
    });

    expect(reducer.state.validity).toBe(Validity.Pending);
  });

  test(`Its validity is valid if all included non-transient fields, adapters, 
  transient fields, and groups are valid.`, () => {
    const firstName = new Field({
      name: 'firstName',
      defaultValue: 'Francine',
      transient: true,
      validators: [StringValidators.required()],
    });

    const lastName = new Field({
      name: 'lastName',
      defaultValue: 'Aubin',
      transient: true,
      validators: [StringValidators.required()],
    });

    const firstAndLast = new Group({
      name: 'firstAndLast',
      members: [firstName, lastName],
    });

    const fullName = new Adapter({
      name: 'fullName',
      source: firstAndLast,
      adaptFn: ({ value }): string => `${value.lastName}, ${value.lastName}`,
    });

    type Members = {
      fields: [typeof firstName, typeof lastName];
      adapters: [typeof fullName];
      groups: [typeof firstAndLast];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [fullName],
      transientFields: [firstName, lastName],
      groups: [firstAndLast],
    });

    expect(reducer.state.validity).toBe(Validity.Valid);
  });

  test(`When the value of a non-transient field changes, its value is 
  updated.`, () => {
    const firstName = new Field({ name: 'firstName', defaultValue: 'Felix' });

    const lastName = new Field({
      name: 'lastName',
      defaultValue: 'Mendelssohn',
    });

    type Members = {
      fields: [typeof firstName, typeof lastName];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [firstName, lastName],
      transientFields: [],
      groups: [],
    });
    expect(reducer.state.value).toStrictEqual({
      firstName: 'Felix',
      lastName: 'Mendelssohn',
    });

    firstName.setValue('Fanny');
    expect(reducer.state.value).toStrictEqual({
      firstName: 'Fanny',
      lastName: 'Mendelssohn',
    });
  });

  test(`When the exclude property a non-transient field changes, its value is 
  updated.`, () => {
    const firstName = new Field({ name: 'firstName', defaultValue: 'Clara' });

    const lastName = new Field({ name: 'lastName', defaultValue: 'Schumann' });

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Josephine',
      excludeByDefault: true,
    });

    type Members = {
      fields: [typeof firstName, typeof lastName, typeof middleName];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [firstName, lastName, middleName],
      transientFields: [],
      groups: [],
    });

    expect(reducer.state.value).toStrictEqual({
      firstName: 'Clara',
      lastName: 'Schumann',
    });

    middleName.setExclude(false);

    expect(reducer.state.value).toStrictEqual({
      firstName: 'Clara',
      middleName: 'Josephine',
      lastName: 'Schumann',
    });
  });

  test(`When the validity of an non-transient changes, its validity is 
  updated.`, () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    type Members = {
      fields: [typeof requiredField];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [requiredField],
      transientFields: [],
      groups: [],
    });

    expect(reducer.state.validity).toBe(Validity.Invalid);

    requiredField.setValue('test');

    expect(reducer.state.validity).toBe(Validity.Valid);
  });

  test(`When the exclude property a non-transient field changes changes, its 
  validity is updated.`, () => {
    const validField = new Field({ name: 'validField', defaultValue: '' });

    const invalidExcludableField = new ExcludableField({
      name: 'invalidExcludableField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    type Members = {
      fields: [typeof validField, typeof invalidExcludableField];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [validField, invalidExcludableField],
      transientFields: [],
      groups: [],
    });

    expect(reducer.state.validity).toBe(Validity.Invalid);

    invalidExcludableField.setExclude(true);
    expect(reducer.state.validity).toBe(Validity.Valid);
  });

  test(`When the validity of a transient form element changes, its validity is 
  updated.`, () => {
    const validField = new Field({ name: 'validField', defaultValue: '' });

    const requiredTransientField = new Field({
      name: 'requiredTransientField',
      defaultValue: '',
      transient: true,
      validators: [StringValidators.required()],
    });

    type Members = {
      fields: [typeof validField, typeof requiredTransientField];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [validField],
      transientFields: [requiredTransientField],
      groups: [],
    });

    expect(reducer.state.validity).toBe(Validity.Invalid);

    requiredTransientField.setValue('test');

    expect(reducer.state.validity).toBe(Validity.Valid);
  });

  test(`When the exclude property of a transient form element changes, its 
  validity is updated.`, () => {
    const validField = new Field({ name: 'validField', defaultValue: '' });

    const invalidExcludableTransientField = new ExcludableField({
      name: 'invalidExcludableTransientField',
      defaultValue: '',
      transient: true,
      validators: [StringValidators.required()],
    });

    type Members = {
      fields: [typeof validField, typeof invalidExcludableTransientField];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [validField],
      transientFields: [invalidExcludableTransientField],
      groups: [],
    });

    expect(reducer.state.validity).toBe(Validity.Invalid);

    invalidExcludableTransientField.setExclude(true);

    expect(reducer.state.validity).toBe(Validity.Valid);
  });

  test('When the validity of a group changes, its validity is updated.', () => {
    const password = new Field({ name: 'password', defaultValue: 'password' });

    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: '',
      transient: true,
    });

    const passwordGroup = new Group({
      name: 'passwordGroup',
      members: [password, confirmPassword],
      validatorTemplates: [
        {
          predicate: ({ password, confirmPassword }): boolean => {
            return password === confirmPassword;
          },
        },
      ],
    });

    type Members = {
      fields: [typeof password, typeof confirmPassword];
      adapters: [];
      groups: [typeof passwordGroup];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [password],
      transientFields: [confirmPassword],
      groups: [passwordGroup],
    });

    expect(reducer.state.validity).toBe(Validity.Invalid);

    confirmPassword.setValue(password.state.value);

    expect(reducer.state.validity).toBe(Validity.Valid);
  });

  test('When its state changes, it emits the new state to subscribers.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: 'Antonin' });

    const lastName = new Field({ name: 'lastName', defaultValue: 'Dvorak' });

    type Members = {
      fields: [typeof firstName, typeof lastName];
      adapters: [];
      groups: [];
    };

    const reducer = new FormReducer<Members>({
      nonTransientFieldsAndAdapters: [firstName, lastName],
      transientFields: [],
      groups: [],
    });

    expect(reducer.state.value).toStrictEqual({
      firstName: 'Antonin',
      lastName: 'Dvorak',
    });

    reducer.subscribeToState(state => {
      expect(state.value).toStrictEqual({
        firstName: 'August',
        lastName: 'Dvorak',
      });
    });

    firstName.setValue('August');
  });
});
