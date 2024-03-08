import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  DefaultAdapter,
  Field,
  FormValidityReducer,
  Group,
  StringValidators,
  Validity,
} from '../../../../../model';
import { PromiseScheduler } from '../../../../../testing';

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
      name: 'validTransientField',
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

  test('Upon instantiation, if at least one group is pending and all other members are either pending or valid, its validity is invalid.', () => {});

  test('Upon instantiation, if all included members are valid, its validity is valid.', () => {});
  test('Upon instantiation, if there are no included members, its validity is valid.', () => {});
  test('Upon instantiation, if there are no members, its validity is valid.', () => {});

  test('When its validity is pending and an adapter becomes invalid, its validity becomes invalid.', () => {});
  test('When its validity is valid and an adapter becomes invalid, its validity becomes invalid.', () => {});
  test('When its validity is pending and a transient form element becomes invalid, its validity becomes invalid.', () => {});
  test('When its validity is valid and a transient form element becomes invalid, its validity becomes invalid.', () => {});
  test('When its validity is pending and a group becomes invalid, its validity becomes invalid.', () => {});
  test('When its validity is valid and a group becomes invalid, its validity becomes invalid.', () => {});

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
