import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  DefaultAdapter,
  ExcludableField,
  Field,
  FormValidityReducer,
  Group,
  StringValidators,
  Validity,
} from '../../../../../model';
import { PromiseScheduler } from '../../../../../testing';
import { DefaultExcludableAdapter } from '../../../../../model/adapters/classes/concrete/default-excludable-adapter';

describe('FormValidityReducer', () => {
  test('Upon instantiation, if at least one included adapter is invalid, its validity is invalid.', () => {
    const invalidField = new Field({
      name: 'invalidField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const invalidAdapter = new DefaultAdapter({
      source: invalidField,
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

    expect(invalidAdapter.state.validity).toBe(Validity.Invalid);
    expect(validTransientField.state.validity).toBe(Validity.Valid);
    expect(validGroup.state.validity).toBe(Validity.Valid);

    const reducer = new FormValidityReducer({
      adapters: [invalidAdapter],
      transientFormElements: [validTransientField],
      groups: [validGroup],
    });
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('Upon instantiation, if at least one included transient form element is invalid, its validity is invalid.', () => {
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const validAdapter = new DefaultAdapter({ source: validField });
    const invalidTransientField = new Field({
      name: 'invalidTransientField',
      defaultValue: '',
      transient: true,
      validators: [StringValidators.required()],
    });
    const validGroup = new Group({ name: 'validGroup', members: [validField] });

    expect(validAdapter.state.validity).toBe(Validity.Valid);
    expect(invalidTransientField.state.validity).toBe(Validity.Invalid);
    expect(validGroup.state.validity).toBe(Validity.Valid);

    const reducer = new FormValidityReducer({
      adapters: [validAdapter],
      transientFormElements: [invalidTransientField],
      groups: [validGroup],
    });
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('Upon instantiation, if at least one group is invalid, its validity is invalid.', () => {
    const validField = new Field({ name: 'validField', defaultValue: '' });
    const validAdapter = new DefaultAdapter({ source: validField });
    const validTransientField = new Field({
      name: 'invalidTransientField',
      defaultValue: '',
      transient: true,
    });
    const invalidGroup = new Group({
      name: 'validGroup',
      members: [],
      validatorTemplates: [
        {
          predicate: (): boolean => false,
        },
      ],
    });

    expect(validAdapter.state.validity).toBe(Validity.Valid);
    expect(validTransientField.state.validity).toBe(Validity.Valid);
    expect(invalidGroup.state.validity).toBe(Validity.Invalid);

    const reducer = new FormValidityReducer({
      adapters: [validAdapter],
      transientFormElements: [validTransientField],
      groups: [invalidGroup],
    });
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('Upon instantiation, if at least one included adapter is pending and all other members are either pending or valid, its validity is pending.', () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        promiseScheduler.createScheduledPromise(value.length > 0),
    });
    const pendingField = new Field({
      name: 'pendingField',
      defaultValue: '',
      asyncValidators: [requiredAsync],
    });
    const pendingAdapter = new DefaultAdapter({
      source: pendingField,
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

    expect(pendingAdapter.state.validity).toBe(Validity.Pending);
    expect(validTransientField.state.validity).toBe(Validity.Valid);
    expect(validGroup.state.validity).toBe(Validity.Valid);

    const reducer = new FormValidityReducer({
      adapters: [pendingAdapter],
      transientFormElements: [validTransientField],
      groups: [validGroup],
    });
    expect(reducer.validity).toBe(Validity.Pending);
  });

  test('Upon instantiation, if at least one included transient form element is pending and all other members are either pending or valid, its validity is pending.', () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        promiseScheduler.createScheduledPromise(value.length > 0),
    });
    const validField = new Field({
      name: 'validField',
      defaultValue: '',
    });
    const validAdapter = new DefaultAdapter({
      source: validField,
    });
    const pendingTransientField = new Field({
      name: 'pendingTransientField',
      defaultValue: '',
      transient: true,
      asyncValidators: [requiredAsync],
    });
    const validGroup = new Group({
      name: 'validGroup',
      members: [validField],
    });

    expect(validAdapter.state.validity).toBe(Validity.Valid);
    expect(pendingTransientField.state.validity).toBe(Validity.Pending);
    expect(validGroup.state.validity).toBe(Validity.Valid);

    const reducer = new FormValidityReducer({
      adapters: [validAdapter],
      transientFormElements: [pendingTransientField],
      groups: [validGroup],
    });
    expect(reducer.validity).toBe(Validity.Pending);
  });

  test('Upon instantiation, if at least one group is pending and all other members are either pending or valid, its validity is pending.', () => {
    const promiseScheduler = new PromiseScheduler();
    const validField = new Field({
      name: 'validField',
      defaultValue: '',
    });
    const validAdapter = new DefaultAdapter({
      source: validField,
    });
    const validTransientField = new Field({
      name: 'validTransientField',
      defaultValue: '',
      transient: true,
    });
    const pendingGroup = new Group({
      name: 'pendingGroup',
      members: [validField],
      asyncValidatorTemplates: [
        {
          predicate: (value): Promise<boolean> => {
            return promiseScheduler.createScheduledPromise(
              value.validField.length > 0,
            );
          },
        },
      ],
    });

    expect(validAdapter.state.validity).toBe(Validity.Valid);
    expect(validTransientField.state.validity).toBe(Validity.Valid);
    expect(pendingGroup.state.validity).toBe(Validity.Pending);

    const reducer = new FormValidityReducer({
      adapters: [validAdapter],
      transientFormElements: [validTransientField],
      groups: [pendingGroup],
    });
    expect(reducer.validity).toBe(Validity.Pending);
  });

  test('Upon instantiation, if all included members are valid, its validity is valid.', () => {
    const validField = new Field({
      name: 'validField',
      defaultValue: '',
    });
    const validAdapter = new DefaultAdapter({
      source: validField,
    });
    const validTransientField = new Field({
      name: 'validTransientField',
      defaultValue: '',
      transient: true,
    });
    const validGroup = new Group({
      name: 'validGroup',
      members: [validField],
    });

    expect(validAdapter.state.validity).toBe(Validity.Valid);
    expect(validTransientField.state.validity).toBe(Validity.Valid);
    expect(validGroup.state.validity).toBe(Validity.Valid);

    const reducer = new FormValidityReducer({
      adapters: [validAdapter],
      transientFormElements: [validTransientField],
      groups: [validGroup],
    });
    expect(reducer.validity).toBe(Validity.Valid);
  });

  test('Upon instantiation, if there are no included members, its validity is valid.', () => {
    const invalidExcludedField = new ExcludableField({
      name: 'invalidExcludedField',
      defaultValue: '',
      validators: [StringValidators.required()],
      excludeByDefault: true,
    });
    const invalidExcludedAdapter = new DefaultExcludableAdapter({
      source: invalidExcludedField,
    });
    const invalidExcludedTransientField = new ExcludableField({
      name: 'invalidExcludedTransientField',
      defaultValue: '',
      validators: [StringValidators.required()],
      excludeByDefault: true,
    });
    const reducer = new FormValidityReducer({
      adapters: [invalidExcludedAdapter],
      transientFormElements: [invalidExcludedTransientField],
      groups: [],
    });
    expect(reducer.validity).toBe(Validity.Valid);
  });

  test('Upon instantiation, if there are no members, its validity is valid.', () => {
    const reducer = new FormValidityReducer({
      adapters: [],
      transientFormElements: [],
      groups: [],
    });
    expect(reducer.validity).toBe(Validity.Valid);
  });

  test('When its validity is pending and an adapter becomes invalid, its validity becomes invalid.', () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        promiseScheduler.createScheduledPromise(value.length > 0),
    });
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
    });
    const requiredAdapter = new DefaultAdapter({
      source: requiredField,
    });
    const pendingTransientField = new Field({
      name: 'pendingTransientField',
      defaultValue: '',
      transient: true,
      asyncValidators: [requiredAsync],
    });

    const reducer = new FormValidityReducer({
      adapters: [requiredAdapter],
      transientFormElements: [pendingTransientField],
      groups: [],
    });
    expect(requiredAdapter.state.validity).toBe(Validity.Valid);
    expect(pendingTransientField.state.validity).toBe(Validity.Pending);
    expect(reducer.validity).toBe(Validity.Pending);

    requiredField.setValue('');
    reducer.processAdapterStateUpdate(
      requiredAdapter.name,
      requiredAdapter.state,
    );
    expect(requiredAdapter.state.validity).toBe(Validity.Invalid);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('When its validity is valid and an adapter becomes invalid, its validity becomes invalid.', () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: 'test',
      validators: [StringValidators.required()],
    });
    const requiredAdapter = new DefaultAdapter({
      source: requiredField,
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

    const reducer = new FormValidityReducer({
      adapters: [requiredAdapter],
      transientFormElements: [validTransientField],
      groups: [validGroup],
    });
    expect(requiredAdapter.state.validity).toBe(Validity.Valid);
    expect(validTransientField.state.validity).toBe(Validity.Valid);
    expect(validGroup.state.validity).toBe(Validity.Valid);
    expect(reducer.validity).toBe(Validity.Valid);

    requiredField.setValue('');
    reducer.processAdapterStateUpdate(
      requiredAdapter.name,
      requiredAdapter.state,
    );
    expect(requiredAdapter.state.validity).toBe(Validity.Invalid);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('When its validity is pending and a transient form element becomes invalid, its validity becomes invalid.', () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> =>
        promiseScheduler.createScheduledPromise(value.length > 0),
    });
    const validField = new Field({
      name: 'validField',
      defaultValue: '',
    });
    const validAdapter = new DefaultAdapter({ source: validField });
    const pendingField = new Field({
      name: 'pendingField',
      defaultValue: '',
      asyncValidators: [requiredAsync],
    });
    const pendingAdapter = new DefaultAdapter({
      source: pendingField,
    });
    const requiredTransientField = new Field({
      name: 'requiredTransientField',
      defaultValue: 'test',
      transient: true,
      validators: [StringValidators.required()],
    });
    const validGroup = new Group({
      name: 'validGroup',
      members: [validField],
    });
    const reducer = new FormValidityReducer({
      adapters: [validAdapter, pendingAdapter],
      transientFormElements: [requiredTransientField],
      groups: [validGroup],
    });
    expect(validAdapter.state.validity).toBe(Validity.Valid);
    expect(pendingAdapter.state.validity).toBe(Validity.Pending);
    expect(requiredTransientField.state.validity).toBe(Validity.Valid);
    expect(validGroup.state.validity).toBe(Validity.Valid);
    expect(reducer.validity).toBe(Validity.Pending);

    requiredTransientField.setValue('');
    reducer.processTransientElementStateUpdate(
      requiredTransientField.name,
      requiredTransientField.state,
    );
    expect(requiredTransientField.state.validity).toBe(Validity.Invalid);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('When its validity is valid and a transient form element becomes invalid, its validity becomes invalid.', () => {
    const validField = new Field({
      name: 'validField',
      defaultValue: '',
    });
    const validAdapter = new DefaultAdapter({ source: validField });
    const requiredTransientField = new Field({
      name: 'requiredTransientField',
      defaultValue: 'test',
      transient: true,
      validators: [StringValidators.required()],
    });
    const validGroup = new Group({
      name: 'validGroup',
      members: [validField],
    });
    const reducer = new FormValidityReducer({
      adapters: [validAdapter],
      transientFormElements: [requiredTransientField],
      groups: [validGroup],
    });
    expect(validAdapter.state.validity).toBe(Validity.Valid);
    expect(requiredTransientField.state.validity).toBe(Validity.Valid);
    expect(validGroup.state.validity).toBe(Validity.Valid);
    expect(reducer.validity).toBe(Validity.Valid);

    requiredTransientField.setValue('');
    reducer.processTransientElementStateUpdate(
      requiredTransientField.name,
      requiredTransientField.state,
    );
    expect(requiredTransientField.state.validity).toBe(Validity.Invalid);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('When its validity is pending and a group becomes invalid, its validity becomes invalid.', () => {
    const promiseScheduler = new PromiseScheduler();
    const unavailableEmails = new Set<string>(['user@example.com']);
    const emailAvailable = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(
          !unavailableEmails.has(value),
        );
      },
    });
    const email = new Field({
      name: 'email',
      defaultValue: 'user@example.com',
      asyncValidators: [emailAvailable],
    });
    const emailAdapter = new DefaultAdapter({ source: email });
    const password = new Field({
      name: 'password',
      defaultValue: 'password',
      validators: [StringValidators.required()],
    });
    const passwordAdapter = new DefaultAdapter({ source: password });
    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: 'password',
      transient: true,
      validators: [StringValidators.required()],
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
    const reducer = new FormValidityReducer({
      adapters: [emailAdapter, passwordAdapter],
      transientFormElements: [confirmPassword],
      groups: [passwordGroup],
    });
    expect(emailAdapter.state.validity).toBe(Validity.Pending);
    expect(passwordAdapter.state.validity).toBe(Validity.Valid);
    expect(confirmPassword.state.validity).toBe(Validity.Valid);
    expect(passwordGroup.state.validity).toBe(Validity.Valid);
    expect(reducer.validity).toBe(Validity.Pending);

    confirmPassword.setValue('PASSWORD');
    reducer.processGroupStateUpdate(passwordGroup.name, passwordGroup.state);
    expect(passwordGroup.state.validity).toBe(Validity.Invalid);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('When its validity is valid and a group becomes invalid, its validity becomes invalid.', () => {
    const email = new Field({
      name: 'email',
      defaultValue: 'user@example.com',
      validators: [StringValidators.required()],
    });
    const emailAdapter = new DefaultAdapter({ source: email });
    const password = new Field({
      name: 'password',
      defaultValue: 'password',
      validators: [StringValidators.required()],
    });
    const passwordAdapter = new DefaultAdapter({ source: password });
    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: 'password',
      transient: true,
      validators: [StringValidators.required()],
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
    const reducer = new FormValidityReducer({
      adapters: [emailAdapter, passwordAdapter],
      transientFormElements: [confirmPassword],
      groups: [passwordGroup],
    });
    expect(emailAdapter.state.validity).toBe(Validity.Valid);
    expect(passwordAdapter.state.validity).toBe(Validity.Valid);
    expect(confirmPassword.state.validity).toBe(Validity.Valid);
    expect(passwordGroup.state.validity).toBe(Validity.Valid);
    expect(reducer.validity).toBe(Validity.Valid);

    confirmPassword.setValue('PASSWORD');
    reducer.processGroupStateUpdate(passwordGroup.name, passwordGroup.state);
    expect(passwordGroup.state.validity).toBe(Validity.Invalid);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('When the sole invalid adapter becomes valid and all other members are either pending or valid, its validity becomes pending.', () => {});
  test('When the sole invalid transient form element becomes valid and all other members are either pending or valid, its validity becomes pending.', () => {});
  test('When the sole invalid group becomes valid and all other members are either pending or valid, its validity becomes pending.', () => {});

  test('When the sole invalid adapter becomes pending and all other members are valid, its validity becomes pending.', () => {});
  test('When the sole invalid transient form element becomes pending and all other members are valid, its validity becomes pending.', () => {});
  test('When the sole invalid group becomes pending and all other members are valid, its validity becomes pending.', () => {});

  test('When the sole invalid adapter becomes valid and all other members are valid, its validity becomes valid.', () => {});
  test('When the sole invalid transient form element becomes valid and all other members are valid, its validity becomes valid.', () => {});
  test('When the sole invalid group becomes valid and all other members are valid, its validity becomes valid.', () => {});

  test('When the sole pending adapter becomes valid and all other members are valid, its validity becomes valid.', () => {});
  test('When the sole pending transient form element becomes valid and all other members are valid, its validity becomes valid.', () => {});
  test('When the sole pending group becomes valid and all other members are valid, its validity becomes valid.', () => {});

  test('When the sole invalid adapter becomes excluded and all other members are either pending or valid, its validity becomes pending.', () => {});
  test('When the sole invalid transient form element becomes excluded and all other members are either pending or valid, its validity becomes pending.', () => {});

  test('When the sole invalid adapter becomes excluded and all other members are valid, its validity becomes valid.', () => {});
  test('When the sole invalid transient form element becomes excluded and all other members are valid, its validity becomes valid.', () => {});

  test('When the sole pending adapter becomes excluded and all other members are valid, its validity becomes valid.', () => {});
  test('When the sole pending transient form element becomes excluded and all other members are valid, its validity becomes valid.', () => {});

  test('When a previously excluded invalid adapter becomes included, its validity becomes invalid.', () => {});
  test('When a previously excluded invalid transient form element becomes included, its validity becomes invalid.', () => {});

  test('When a previously excluded pending adapter becomes included and all other members are valid or pending, its validity becomes pending.', () => {});
  test('When a previously excluded pending transient form element becomes included and all other members are valid or pending, its validity becomes pending.', () => {});
});
