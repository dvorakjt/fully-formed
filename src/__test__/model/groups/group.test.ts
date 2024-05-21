import { describe, test, expect } from 'vitest';
import {
  Group,
  ExcludableField,
  Field,
  StringValidators,
  Validity,
  GroupValiditySource,
  AsyncValidator,
  Validator,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';

//TODO : need to test messages and that pending validators are ignored when the value is updated
describe('Group', () => {
  test(`Its value is initialized to an object containing the names and values of 
  its members.`, () => {
    const firstName = new Field({ name: 'firstName', defaultValue: 'John' });
    const lastName = new Field({ name: 'lastName', defaultValue: 'Cage' });

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Milton',
    });

    const fullName = new Group({
      name: 'fullName',
      members: [firstName, middleName, lastName],
    });

    const occupation = new Field({
      name: 'occupation',
      defaultValue: 'composer',
    });

    const nameAndOccupation = new Group({
      name: 'nameAndOccupation',
      members: [fullName, occupation],
    });

    expect(nameAndOccupation.state.value).toStrictEqual({
      fullName: {
        firstName: 'John',
        middleName: 'Milton',
        lastName: 'Cage',
      },
      occupation: 'composer',
    });
  });

  test('Its value does not contain the values of any excluded members.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: '' });

    const lastName = new Field({ name: 'lastName', defaultValue: '' });

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: '',
      excludeByDefault: true,
    });

    const fullName = new Group({
      name: 'fullName',
      members: [firstName, middleName, lastName],
    });

    expect(fullName.state.value).toStrictEqual({
      firstName: '',
      lastName: '',
    });
  });

  test(`If no validators, asyncValidators, validatorTemplates or 
  asyncValidatorTemplates were provided to its constructor, it is valid when all 
  members are valid.`, () => {
    const firstName = new Field({ name: 'firstName', defaultValue: '' });

    const lastName = new Field({ name: 'lastName', defaultValue: '' });

    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: '',
      excludeByDefault: true,
      validators: [StringValidators.required()],
    });

    const fullName = new Group({
      name: 'fullName',
      members: [firstName, middleName, lastName],
    });

    expect(fullName.state.validity).toBe(Validity.Valid);
  });

  test(`If the reduced validity of its members is invalid, its validity is 
  invalid.`, () => {
    const invalidField = new Field({
      name: 'invalidField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const validField = new Field({ name: 'validField', defaultValue: '' });

    const group = new Group({
      name: 'invalidGroup',
      members: [invalidField, validField],
    });

    expect(group.state.validity).toBe(Validity.Invalid);
  });

  test(`If the reduced validity of its members is invalid, its validity source 
  is reduction.`, () => {
    const invalidField = new Field({
      name: 'invalidField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const validField = new Field({ name: 'validField', defaultValue: '' });

    const group = new Group({
      name: 'group',
      members: [invalidField, validField],
    });

    expect(group.state.validitySource).toBe(GroupValiditySource.Reduction);
  });

  test(`If the reduced validity of its members is pending, its validity is 
  pending.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const asyncRequired = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });

    const pendingField = new Field({
      name: 'pendingField',
      defaultValue: '',
      asyncValidators: [asyncRequired],
      delayAsyncValidatorExecution: 0,
    });

    const validField = new Field({ name: 'validField', defaultValue: '' });

    const group = new Group({
      name: 'group',
      members: [pendingField, validField],
    });

    expect(group.state.validity).toBe(Validity.Pending);
  });

  test(`If the reduced validity of its members is pending, its validity source 
  is reduction.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const asyncRequired = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });

    const pendingField = new Field({
      name: 'pendingField',
      defaultValue: '',
      asyncValidators: [asyncRequired],
      delayAsyncValidatorExecution: 0,
    });

    const validField = new Field({ name: 'validField', defaultValue: '' });

    const group = new Group({
      name: 'group',
      members: [pendingField, validField],
    });

    expect(group.state.validitySource).toBe(GroupValiditySource.Reduction);
  });

  test(`If all its included members are valid, its validity source is 
  validation.`, () => {
    const firstName = new Field({ name: 'firstName', defaultValue: '' });
    const lastName = new Field({ name: 'lastName', defaultValue: '' });

    const nameGroup = new Group({
      name: 'nameGroup',
      members: [firstName, lastName],
    });

    expect(nameGroup.state.validitySource).toBe(GroupValiditySource.Validation);
  });

  type ContactInfoGroupValue = {
    primaryEmail: string;
    secondaryEmail?: string;
  };

  const contactInfoValidator = new Validator<ContactInfoGroupValue>({
    predicate: (value): boolean => {
      return value.primaryEmail !== value.secondaryEmail;
    },
  });

  test('If its validators return an invalid result, its validity is invalid.', () => {
    const primaryEmail = new Field({
      name: 'primaryEmail',
      defaultValue: 'user@example.com',
    });

    const secondaryEmail = new ExcludableField({
      name: 'secondaryEmail',
      defaultValue: 'user@example.com',
    });

    const contactInfoGroup = new Group({
      name: 'contactInfo',
      members: [primaryEmail, secondaryEmail],
      validators: [contactInfoValidator],
    });

    expect(contactInfoGroup.state.validity).toBe(Validity.Invalid);
  });

  test(`If its validators return a valid result and no asyncValidators were 
  provided to its constructor, its validity is valid.`, () => {
    const primaryEmail = new Field({
      name: 'primaryEmail',
      defaultValue: 'user@example.com',
    });

    const secondaryEmail = new ExcludableField({
      name: 'secondaryEmail',
      defaultValue: '',
    });

    const contactInfoGroup = new Group({
      name: 'contactInfo',
      members: [primaryEmail, secondaryEmail],
      validators: [contactInfoValidator],
    });

    expect(contactInfoGroup.state.validity).toBe(Validity.Valid);
  });

  test(`If its validators return a valid result and asyncValidators were 
  provided to its constructor, its validity is pending until those 
  asyncValidators return.`, () => {
    type SignUpGroupValue = {
      email: string;
      password: string;
      confirmPassword: string;
    };

    const passwordsMatch = new Validator<SignUpGroupValue>({
      predicate: (value): boolean => {
        return value.password === value.confirmPassword;
      },
    });

    const promiseScheduler = new PromiseScheduler();

    const existingUsers = new Set<string>(['user@example.com']);

    const emailAvailable = new AsyncValidator<SignUpGroupValue>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(
          !existingUsers.has(value.email),
        );
      },
    });

    const email = new Field({
      name: 'email',
      defaultValue: 'user@example.com',
    });

    const password = new Field({ name: 'password', defaultValue: 'password' });

    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: 'password',
      transient: true,
    });

    const signUpGroup = new Group({
      name: 'signUpGroup',
      members: [email, password, confirmPassword],
      validators: [passwordsMatch],
      asyncValidators: [emailAvailable],
      delayAsyncValidatorExecution: 0,
    });

    expect(signUpGroup.state.validity).toBe(Validity.Pending);
  });

  test('If its asyncValidators return an invalid result, its validity is invalid.', () => {
    type SignUpGroupValue = {
      email: string;
      password: string;
      confirmPassword: string;
    };

    const passwordsMatch = new Validator<SignUpGroupValue>({
      predicate: (value): boolean => {
        return value.password === value.confirmPassword;
      },
    });

    const promiseScheduler = new PromiseScheduler();

    const existingUsers = new Set<string>(['user@example.com']);

    const emailAvailable = new AsyncValidator<SignUpGroupValue>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(
          !existingUsers.has(value.email),
        );
      },
    });

    const email = new Field({
      name: 'email',
      defaultValue: 'user@example.com',
    });

    const password = new Field({ name: 'password', defaultValue: 'password' });

    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: 'password',
      transient: true,
    });

    const signUpGroup = new Group({
      name: 'signUpGroup',
      members: [email, password, confirmPassword],
      validators: [passwordsMatch],
      asyncValidators: [emailAvailable],
      delayAsyncValidatorExecution: 0,
    });

    expect(signUpGroup.state.validity).toBe(Validity.Pending);

    signUpGroup.subscribeToState(state => {
      expect(state.validity).toBe(Validity.Invalid);
    });

    promiseScheduler.resolveAll();
  });

  test('If its asyncValidators return a valid result, its validity is valid.', () => {
    type SignUpGroupValue = {
      email: string;
      password: string;
      confirmPassword: string;
    };

    const passwordsMatch = new Validator<SignUpGroupValue>({
      predicate: (value): boolean => {
        return value.password === value.confirmPassword;
      },
    });

    const promiseScheduler = new PromiseScheduler();

    const existingUsers = new Set<string>(['user@example.com']);

    const emailAvailable = new AsyncValidator<SignUpGroupValue>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(
          !existingUsers.has(value.email),
        );
      },
    });

    const email = new Field({
      name: 'email',
      defaultValue: 'new-user@example.com',
    });

    const password = new Field({ name: 'password', defaultValue: 'password' });

    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: 'password',
      transient: true,
    });

    const signUpGroup = new Group({
      name: 'signUpGroup',
      members: [email, password, confirmPassword],
      validators: [passwordsMatch],
      asyncValidators: [emailAvailable],
      delayAsyncValidatorExecution: 0,
    });

    expect(signUpGroup.state.validity).toBe(Validity.Pending);

    signUpGroup.subscribeToState(state => {
      expect(state.validity).toBe(Validity.Valid);
    });

    promiseScheduler.resolveAll();
  });

  test(`If validator templates were provided to its constructor, validators are 
  created and applied to its value.`, () => {
    const email = new Field({
      name: 'email',
      defaultValue: 'user@example.com',
    });
    const password = new Field({ name: 'password', defaultValue: 'password' });
    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: '',
      transient: true,
    });

    const validMessage = 'The passwords match.';
    const invalidMessage =
      'Please ensure the confirmed password matches the password.';

    const signUpGroup = new Group({
      name: 'signUpGroup',
      members: [email, password, confirmPassword],
      validatorTemplates: [
        {
          predicate: (value): boolean => {
            return value.password === value.confirmPassword;
          },
          validMessage,
          invalidMessage,
        },
      ],
    });

    expect(signUpGroup.state).toStrictEqual({
      value: {
        email: 'user@example.com',
        password: 'password',
        confirmPassword: '',
      },
      validity: Validity.Invalid,
      messages: [
        {
          text: invalidMessage,
          validity: Validity.Invalid,
        },
      ],
      validitySource: GroupValiditySource.Validation,
    });

    confirmPassword.setValue(password.state.value);

    expect(signUpGroup.state).toStrictEqual({
      value: {
        email: 'user@example.com',
        password: 'password',
        confirmPassword: 'password',
      },
      validity: Validity.Valid,
      messages: [
        {
          text: validMessage,
          validity: Validity.Valid,
        },
      ],
      validitySource: GroupValiditySource.Validation,
    });
  });

  test(`If async validator templates were provided to its constructor, async 
  validators are created and applied to its value.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const existingUsers = new Set<string>(['user@example.com']);

    const email = new Field({
      name: 'email',
      defaultValue: 'user@example.com',
    });

    const password = new Field({ name: 'password', defaultValue: 'password' });

    const signUpGroup = new Group({
      name: 'signUpGroup',
      members: [email, password],
      asyncValidatorTemplates: [
        {
          predicate: (value): Promise<boolean> => {
            return promiseScheduler.createScheduledPromise(
              !existingUsers.has(value.email),
            );
          },
        },
      ],
      delayAsyncValidatorExecution: 0,
    });

    expect(signUpGroup.state.validity).toBe(Validity.Pending);

    signUpGroup.subscribeToState(state => {
      console.log(state);
      expect(state.validity).toBe(Validity.Invalid);
    });

    promiseScheduler.resolveAll();
  });

  test('When its value changes, its async validators validate the new value.', () => {
    const email = new Field({ name: 'email', defaultValue: '' });
    const password = new Field({ name: 'password', defaultValue: '' });

    const existingUsers = new Set<string>(['user@example.com']);

    const promiseScheduler = new PromiseScheduler();

    const signUpGroup = new Group({
      name: 'signUpGroup',
      members: [email, password],
      asyncValidatorTemplates: [
        {
          predicate: (value): Promise<boolean> => {
            return promiseScheduler.createScheduledPromise(
              !existingUsers.has(value.email),
            );
          },
        },
      ],
      delayAsyncValidatorExecution: 0,
    });

    email.setValue('user@example.com');

    signUpGroup.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: {
          email: 'user@example.com',
          password: '',
        },
        validity: Validity.Invalid,
        validitySource: GroupValiditySource.Validation,
        messages: [],
      });
    });

    promiseScheduler.resolveAll();
  });

  test(`When one of its included members becomes invalid, its validity becomes 
  invalid.`, () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
    });

    const optionalField = new Field({
      name: 'optionalField',
      defaultValue: '',
    });

    const group = new Group({
      name: 'group',
      members: [requiredField, optionalField],
    });

    expect(group.state.validity).toBe(Validity.Valid);

    requiredField.setValue('');

    expect(group.state.validity).toBe(Validity.Invalid);
  });

  test(`When one of its included members becomes pending and all other included 
  members are valid, its validity becomes pending.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });

    const asyncValidatedField = new Field({
      name: 'asyncValidatedField',
      defaultValue: 'test',
      asyncValidators: [requiredAsync],
      delayAsyncValidatorExecution: 0,
    });

    const validField = new Field({ name: 'validField', defaultValue: '' });
    const group = new Group({
      name: 'group',
      members: [asyncValidatedField, validField],
    });

    group.subscribeToState(state => {
      expect(state.validity).toBe(
        asyncValidatedField.state.value === 'test' ?
          Validity.Valid
        : Validity.Pending,
      );
      if (asyncValidatedField.state.value === 'test') {
        asyncValidatedField.setValue('');
      }
    });
    promiseScheduler.resolveAll();
  });

  test(`When one of its members becomes invalid or pending, its messages array 
  is emptied.`, () => {
    const password = new Field({
      name: 'password',
      defaultValue: 'password',
      validators: [StringValidators.required()],
    });

    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: '',
    });

    const invalidMessage = 'Confirmed password must match password.';

    const passwordGroup = new Group({
      name: 'passwordGroup',
      members: [password, confirmPassword],
      validatorTemplates: [
        {
          predicate: (value): boolean => {
            return value.password === value.confirmPassword;
          },
          invalidMessage,
        },
      ],
    });

    expect(passwordGroup.state.messages).toStrictEqual([
      {
        text: invalidMessage,
        validity: Validity.Invalid,
      },
    ]);

    password.setValue('');

    expect(passwordGroup.state.messages).toStrictEqual([]);
  });

  test(`When one of its members becomes invalid or pending, its validity source 
  becomes reduction.`, () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
    });

    const optionalField = new Field({
      name: 'optionalField',
      defaultValue: '',
    });

    const group = new Group({
      name: 'group',
      members: [requiredField, optionalField],
    });

    expect(group.state.validitySource).toBe(GroupValiditySource.Validation);

    requiredField.setValue('');

    expect(group.state.validitySource).toBe(GroupValiditySource.Reduction);
  });
});
