import { describe, test, expect } from 'vitest';
import {
  FieldGroup,
  ExcludableField,
  Field,
  StringValidators,
  Validity,
  FieldGroupValiditySource,
  AsyncValidator,
} from '../../../../../model';
import { PromiseScheduler } from '../../../../../testing';

//TODO : need to test messages and that pending validators are ignored when the value is updated
describe('FieldGroup', () => {
  test('Its value is initialized to an object containing the names and values of its members.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: 'John' });
    const lastName = new Field({ name: 'lastName', defaultValue: 'Cage' });
    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Milton',
    });
    const fullName = new FieldGroup({
      name: 'fullName',
      members: [firstName, middleName, lastName],
    });
    const occupation = new Field({
      name: 'occupation',
      defaultValue: 'composer',
    });
    const nameAndOccupation = new FieldGroup({
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
    const fullName = new FieldGroup({
      name: 'fullName',
      members: [firstName, middleName, lastName],
    });
    expect(fullName.state.value).toStrictEqual({
      firstName: '',
      lastName: '',
    });
  });

  test('If no validators, asyncValidators, validatorTemplates or asyncValidatorTemplates were provided to its constructor, it is valid when all members are valid.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: '' });
    const lastName = new Field({ name: 'lastName', defaultValue: '' });
    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: '',
      excludeByDefault: true,
      validators: [StringValidators.required()],
    });
    const fullName = new FieldGroup({
      name: 'fullName',
      members: [firstName, middleName, lastName],
    });
    expect(fullName.state.validity).toBe(Validity.Valid);
  });

  test('If the reduced validity of its members is invalid, its validity is invalid.', () => {
    const invalidField = new Field({
      name: 'invalidField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const fieldGroup = new FieldGroup({
      name: 'invalidGroup',
      members: [invalidField, validField],
    });
    expect(fieldGroup.state.validity).toBe(Validity.Invalid);
  });

  test('If the reduced validity of its members is invalid, its validity source is reduction.', () => {
    const invalidField = new Field({
      name: 'invalidField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const fieldGroup = new FieldGroup({
      name: 'fieldGroup',
      members: [invalidField, validField],
    });
    expect(fieldGroup.state.validitySource).toBe(
      FieldGroupValiditySource.Reduction,
    );
  });

  test('If the reduced validity of its members is pending, its validity is pending.', () => {
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
    });
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const fieldGroup = new FieldGroup({
      name: 'fieldGroup',
      members: [pendingField, validField],
    });
    expect(fieldGroup.state.validity).toBe(Validity.Pending);
  });

  test('If the reduced validity of its members is pending, its validity source is reduction.', () => {
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
    });
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const fieldGroup = new FieldGroup({
      name: 'fieldGroup',
      members: [pendingField, validField],
    });
    expect(fieldGroup.state.validitySource).toBe(
      FieldGroupValiditySource.Reduction,
    );
  });

  test('If all its included members are valid, its validity source is validation.', () => {});
  test('If its validators return an invalid result, its validity is invalid.', () => {});
  test('If its validators return a valid result and no asyncValidators were provided to its constructor, its validity is valid.', () => {});
  test('If its validators return a valid result and asyncValidators were provided to its constructor, its validity is pending until those asyncValidators return.', () => {});
  test('If its asyncValidators return an invalid result, its validity is invalid.', () => {});
  test('If its asyncValidators return a valid result, its validity is valid.', () => {});
  test('If validator templates were provided to its constructor, validators are created and applied to its value.', () => {});
  test('If async validator templates were provided to its constructor, async validators are created and applied to its value.', () => {});
});
