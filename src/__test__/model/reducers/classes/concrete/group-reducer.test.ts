import { describe, test, expect, vi } from 'vitest';
import {
  AsyncValidator,
  ExcludableField,
  Field,
  GroupReducer,
  StringValidators,
  Validity,
} from '../../../../../model';
import { PromiseScheduler } from '../../../../../test-utils';

describe('GroupReducer', () => {
  test('Its value defaults to an object containing the values of its members.', () => {
    const firstName = new Field({
      name: 'firstName',
      defaultValue: 'Mieczyslaw',
    });
    const lastName = new Field({ name: 'lastName', defaultValue: 'Weinberg' });
    const nameGroupReducer = new GroupReducer({
      members: [firstName, lastName],
    });
    expect(nameGroupReducer.state.value).toStrictEqual({
      firstName: 'Mieczyslaw',
      lastName: 'Weinberg',
    });
  });

  test('Its value does not include any excluded members.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: '' });
    const lastName = new Field({ name: 'lastName', defaultValue: '' });
    const previousName = new ExcludableField({
      name: 'previousName',
      defaultValue: '',
      excludeByDefault: true,
    });
    const nameGroupReducer = new GroupReducer({
      members: [firstName, lastName, previousName],
    });
    expect(nameGroupReducer.state.value).toStrictEqual({
      firstName: '',
      lastName: '',
    });
  });

  test('Its validity defaults to Validity.Valid if all included members are valid.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: '' });
    const lastName = new Field({ name: 'lastName', defaultValue: '' });
    const previousName = new ExcludableField({
      name: 'previousName',
      defaultValue: '',
      validators: [StringValidators.required()],
      excludeByDefault: true,
    });
    const nameGroupReducer = new GroupReducer({
      members: [firstName, lastName, previousName],
    });
    expect(nameGroupReducer.state.validity).toBe(Validity.Valid);
  });

  test('Its validity defaults to Validity.Pending there are pending included members but no invalid included members.', () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const pendingField = new Field({
      name: 'pendingField',
      defaultValue: '',
      asyncValidators: [requiredAsync],
    });
    const invalidExcludedField = new ExcludableField({
      name: 'invalidExcludedField',
      defaultValue: '',
      validators: [StringValidators.required()],
      excludeByDefault: true,
    });
    const groupReducer = new GroupReducer({
      members: [validField, pendingField, invalidExcludedField],
    });
    expect(groupReducer.state.validity).toBe(Validity.Pending);
  });

  test("Its validity defaults to Validity.Invalid if at least one included member's validity is Validity.Invalid.", () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const pendingField = new Field({
      name: 'pendingField',
      defaultValue: '',
      asyncValidators: [requiredAsync],
    });
    const invalidField = new Field({
      name: 'invalidField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const groupReducer = new GroupReducer({
      members: [validField, pendingField, invalidField],
    });
    expect(groupReducer.state.validity).toBe(Validity.Invalid);
  });

  test('When the value of one of its members changes, its value is updated.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: '' });
    const lastName = new Field({ name: 'lastName', defaultValue: '' });
    const nameGroupReducer = new GroupReducer({
      members: [firstName, lastName],
    });
    firstName.setValue('Johannes');
    expect(nameGroupReducer.state.value).toStrictEqual({
      firstName: 'Johannes',
      lastName: '',
    });
    lastName.setValue('Brahms');
    expect(nameGroupReducer.state.value).toStrictEqual({
      firstName: 'Johannes',
      lastName: 'Brahms',
    });
  });

  test('When the exclude property of one of its members changes, its value is updated.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: 'Pete' });
    const lastName = new Field({ name: 'lastName', defaultValue: 'Fountain' });
    const previousName = new ExcludableField({
      name: 'previousName',
      defaultValue: '',
      excludeByDefault: true,
    });
    const nameGroupReducer = new GroupReducer({
      members: [firstName, lastName, previousName],
    });
    previousName.setValue('Pierre');
    expect(nameGroupReducer.state.value).toStrictEqual({
      firstName: 'Pete',
      lastName: 'Fountain',
    });
    previousName.setExclude(false);
    expect(nameGroupReducer.state.value).toStrictEqual({
      firstName: 'Pete',
      lastName: 'Fountain',
      previousName: 'Pierre',
    });
    previousName.setExclude(true);
    expect(nameGroupReducer.state.value).toStrictEqual({
      firstName: 'Pete',
      lastName: 'Fountain',
    });
  });

  test('When the validity of one of its members changes, its validity is updated.', () => {
    const promiseScheduler = new PromiseScheduler();
    const asyncIncludesUpper = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(/[A-Z]/.test(value));
      },
    });
    const asyncValidatedField = new Field({
      name: 'asyncValidatedField',
      defaultValue: '',
      validators: [StringValidators.required()],
      asyncValidators: [asyncIncludesUpper],
    });
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const groupReducer = new GroupReducer({
      members: [asyncValidatedField, validField],
    });
    expect(groupReducer.state.validity).toBe(Validity.Invalid);
    asyncValidatedField.setValue('HELLO');
    expect(groupReducer.state.validity).toBe(Validity.Pending);
    groupReducer.subscribeToState(state => {
      if (state.value.asyncValidatedField === 'HELLO') {
        expect(state.validity).toBe(Validity.Valid);
      } else {
        expect(state.validity).toBe(Validity.Invalid);
      }
    });
    promiseScheduler.resolveAll();
    asyncValidatedField.setValue('');
  });

  test('When the exclude property of one of its members changes, its validity is updated.', () => {
    const excludableRequiredField = new ExcludableField({
      name: 'excludableRequiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const optionalField = new Field({
      name: 'optionalField',
      defaultValue: '',
    });
    const groupReducer = new GroupReducer({
      members: [excludableRequiredField, optionalField],
    });
    expect(groupReducer.state.validity).toBe(Validity.Invalid);
    excludableRequiredField.setExclude(true);
    expect(groupReducer.state.validity).toBe(Validity.Valid);
  });

  test('When the state of one of its members changes, it emits a state update to subscribers.', () => {
    const subscribe = vi.fn();
    const firstName = new Field({ name: 'firstName', defaultValue: 'Johann' });
    const lastName = new Field({ name: 'lastName', defaultValue: 'Strauss' });
    const nameGroupReducer = new GroupReducer({
      members: [firstName, lastName],
    });
    nameGroupReducer.subscribeToState(subscribe);
    firstName.setValue('Richard');
    expect(subscribe).toHaveBeenCalledWith({
      value: {
        firstName: 'Richard',
        lastName: 'Strauss',
      },
      validity: Validity.Valid,
    });
  });
});
