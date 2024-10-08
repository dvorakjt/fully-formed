import { describe, test, expect } from 'vitest';
import {
  ValidityUtils,
  Validity,
  Field,
  StringValidators,
  AsyncValidator,
  Group,
  GroupValiditySource,
} from '../../../../model';
import type { ValidatedState, Validated } from '../../../../model';
import { PromiseScheduler } from '../../../../test-utils';

describe('ValidityUtils', () => {
  test(`ValidityUtils.isValid() returns true when it receives a valid entity,
  state, or validity.`, () => {
    const validState: ValidatedState<string> = {
      value: '',
      validity: Validity.Valid,
    };

    const validEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
    });

    expect(ValidityUtils.isValid(Validity.Valid)).toBe(true);
    expect(ValidityUtils.isValid(validState)).toBe(true);
    expect(ValidityUtils.isValid(validEntity)).toBe(true);
  });

  test(`ValidityUtils.isValid() returns false when it receives an invalid 
  entity, state, or validity.`, () => {
    const invalidState: ValidatedState<string> = {
      value: '',
      validity: Validity.Invalid,
    };

    const invalidEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    expect(ValidityUtils.isValid(Validity.Invalid)).toBe(false);
    expect(ValidityUtils.isValid(invalidState)).toBe(false);
    expect(ValidityUtils.isValid(invalidEntity)).toBe(false);
  });

  test(`ValidityUtils.isValid() returns false when it receives a pending entity,
  state, or validity.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const pendingState: ValidatedState<string> = {
      value: '',
      validity: Validity.Pending,
    };

    const pendingEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: () => promiseScheduler.createScheduledPromise(true),
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    expect(ValidityUtils.isValid(Validity.Pending)).toBe(false);
    expect(ValidityUtils.isValid(pendingState)).toBe(false);
    expect(ValidityUtils.isValid(pendingEntity)).toBe(false);
  });

  test(`ValidityUtils.isValid() returns false when it receives a cautioned 
  entity, state, or validity.`, () => {
    const state: ValidatedState<string> = {
      value: '',
      validity: Validity.Caution,
    };

    const entity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [
        {
          validate: () => ({ validity: Validity.Caution }),
        },
      ],
    });

    expect(ValidityUtils.isValid(Validity.Caution)).toBe(false);
    expect(ValidityUtils.isValid(state)).toBe(false);
    expect(ValidityUtils.isValid(entity)).toBe(false);
  });

  test(`ValidityUtils.isInvalid() returns true when it receives an invalid 
  entity, state, or validity.`, () => {
    const invalidState: ValidatedState<string> = {
      value: '',
      validity: Validity.Invalid,
    };

    const invalidEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    expect(ValidityUtils.isInvalid(Validity.Invalid)).toBe(true);
    expect(ValidityUtils.isInvalid(invalidState)).toBe(true);
    expect(ValidityUtils.isInvalid(invalidEntity)).toBe(true);
  });

  test(`ValidityUtils.isInvalid() returns false when it receives a valid entity,
  state, or validity.`, () => {
    const validState: ValidatedState<string> = {
      value: '',
      validity: Validity.Valid,
    };

    const validEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
    });

    expect(ValidityUtils.isInvalid(Validity.Valid)).toBe(false);
    expect(ValidityUtils.isInvalid(validState)).toBe(false);
    expect(ValidityUtils.isInvalid(validEntity)).toBe(false);
  });

  test(`ValidityUtils.isInvalid() returns false when it receives a pending 
  entity, state, or validity.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const pendingState: ValidatedState<string> = {
      value: '',
      validity: Validity.Pending,
    };

    const pendingEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: () => promiseScheduler.createScheduledPromise(true),
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    expect(ValidityUtils.isInvalid(Validity.Pending)).toBe(false);
    expect(ValidityUtils.isInvalid(pendingState)).toBe(false);
    expect(ValidityUtils.isInvalid(pendingEntity)).toBe(false);
  });

  test(`ValidityUtils.isInvalid() returns false when it receives a cautioned 
  entity, state, or validity.`, () => {
    const state: ValidatedState<string> = {
      value: '',
      validity: Validity.Caution,
    };

    const entity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [
        {
          validate: () => ({ validity: Validity.Caution }),
        },
      ],
    });

    expect(ValidityUtils.isInvalid(Validity.Caution)).toBe(false);
    expect(ValidityUtils.isInvalid(state)).toBe(false);
    expect(ValidityUtils.isInvalid(entity)).toBe(false);
  });

  test(`ValidityUtils.isPending() returns true when it receives a pending 
  entity, state, or validity.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const pendingState: ValidatedState<string> = {
      value: '',
      validity: Validity.Pending,
    };

    const pendingEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: () => promiseScheduler.createScheduledPromise(true),
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    expect(ValidityUtils.isPending(Validity.Pending)).toBe(true);
    expect(ValidityUtils.isPending(pendingState)).toBe(true);
    expect(ValidityUtils.isPending(pendingEntity)).toBe(true);
  });

  test(`ValidityUtils.isPending() returns false when it receives a valid entity,
  state, or validity.`, () => {
    const validState: ValidatedState<string> = {
      value: '',
      validity: Validity.Valid,
    };

    const validEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
    });

    expect(ValidityUtils.isPending(Validity.Valid)).toBe(false);
    expect(ValidityUtils.isPending(validState)).toBe(false);
    expect(ValidityUtils.isPending(validEntity)).toBe(false);
  });

  test(`ValidityUtils.isPending() returns false when it receives an invalid 
  entity, state, or validity.`, () => {
    const invalidState: ValidatedState<string> = {
      value: '',
      validity: Validity.Invalid,
    };

    const invalidEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    expect(ValidityUtils.isPending(Validity.Invalid)).toBe(false);
    expect(ValidityUtils.isPending(invalidState)).toBe(false);
    expect(ValidityUtils.isPending(invalidEntity)).toBe(false);
  });

  test(`ValidityUtils.isPending() returns false when it receives a cautioned 
  entity, state, or validity.`, () => {
    const state: ValidatedState<string> = {
      value: '',
      validity: Validity.Caution,
    };

    const entity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [
        {
          validate: () => ({ validity: Validity.Caution }),
        },
      ],
    });

    expect(ValidityUtils.isPending(Validity.Caution)).toBe(false);
    expect(ValidityUtils.isPending(state)).toBe(false);
    expect(ValidityUtils.isPending(entity)).toBe(false);
  });

  test(`ValidityUtils.isCaution() returns true when it receives a cautioned 
  entity, state, or validity.`, () => {
    const state: ValidatedState<string> = {
      value: '',
      validity: Validity.Caution,
    };

    const entity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [
        {
          validate: () => ({ validity: Validity.Caution }),
        },
      ],
    });

    expect(ValidityUtils.isCaution(Validity.Caution)).toBe(true);
    expect(ValidityUtils.isCaution(state)).toBe(true);
    expect(ValidityUtils.isCaution(entity)).toBe(true);
  });

  test(`ValidityUtils.isCaution() returns false when it receives a valid entity,
  state, or validity.`, () => {
    const validState: ValidatedState<string> = {
      value: '',
      validity: Validity.Valid,
    };

    const validEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
    });

    expect(ValidityUtils.isCaution(Validity.Valid)).toBe(false);
    expect(ValidityUtils.isCaution(validState)).toBe(false);
    expect(ValidityUtils.isCaution(validEntity)).toBe(false);
  });

  test(`ValidityUtils.isCaution() returns false when it receives a pending 
  entity, state, or validity.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const pendingState: ValidatedState<string> = {
      value: '',
      validity: Validity.Pending,
    };

    const pendingEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: () => promiseScheduler.createScheduledPromise(true),
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    expect(ValidityUtils.isCaution(Validity.Pending)).toBe(false);
    expect(ValidityUtils.isCaution(pendingState)).toBe(false);
    expect(ValidityUtils.isCaution(pendingEntity)).toBe(false);
  });

  test(`ValidityUtils.isCaution() returns false when it receives an invalid 
  entity, state, or validity.`, () => {
    const invalidState: ValidatedState<string> = {
      value: '',
      validity: Validity.Invalid,
    };

    const invalidEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    expect(ValidityUtils.isCaution(Validity.Invalid)).toBe(false);
    expect(ValidityUtils.isCaution(invalidState)).toBe(false);
    expect(ValidityUtils.isCaution(invalidEntity)).toBe(false);
  });

  test(`ValidityUtils.isValidOrCaution() returns true when it receives a valid 
  validity, state, or entity.`, () => {
    const validState: ValidatedState<string> = {
      value: '',
      validity: Validity.Valid,
    };

    const validEntity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
    });

    expect(ValidityUtils.isValidOrCaution(Validity.Valid)).toBe(true);
    expect(ValidityUtils.isValidOrCaution(validState)).toBe(true);
    expect(ValidityUtils.isValidOrCaution(validEntity)).toBe(true);
  });

  test(`ValidityUtils.isValidOrCaution() returns true when it receives a 
  cautioned validity, state, or entity.`, () => {
    const state: ValidatedState<string> = {
      value: '',
      validity: Validity.Caution,
    };

    const entity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [
        {
          validate: () => ({ validity: Validity.Caution }),
        },
      ],
    });

    expect(ValidityUtils.isValidOrCaution(Validity.Caution)).toBe(true);
    expect(ValidityUtils.isValidOrCaution(state)).toBe(true);
    expect(ValidityUtils.isValidOrCaution(entity)).toBe(true);
  });

  test(`ValidityUtils.isValidOrCaution() returns false when it receives an
  invalid validity, state, or entity.`, () => {
    const state: ValidatedState<string> = {
      value: '',
      validity: Validity.Invalid,
    };

    const entity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      validators: [
        {
          validate: () => ({ validity: Validity.Invalid }),
        },
      ],
    });

    expect(ValidityUtils.isValidOrCaution(Validity.Invalid)).toBe(false);
    expect(ValidityUtils.isValidOrCaution(state)).toBe(false);
    expect(ValidityUtils.isValidOrCaution(entity)).toBe(false);
  });

  test(`ValidityUtils.isValidOrCaution() returns false when it receives a
  pending validity, state, or entity.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const state: ValidatedState<string> = {
      value: '',
      validity: Validity.Pending,
    };

    const entity: Validated<string> = new Field({
      name: '',
      defaultValue: '',
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: () => promiseScheduler.createScheduledPromise(true),
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    expect(ValidityUtils.isValidOrCaution(Validity.Pending)).toBe(false);
    expect(ValidityUtils.isValidOrCaution(state)).toBe(false);
    expect(ValidityUtils.isValidOrCaution(entity)).toBe(false);
  });

  test(`ValidityUtils.minValidity() returns Validity.Invalid if one item is 
  invalid.`, () => {
    expect(
      ValidityUtils.minValidity([
        Validity.Valid,
        Validity.Pending,
        Validity.Invalid,
      ]),
    ).toBe(Validity.Invalid);
  });

  test(`ValidityUtils.minValidity() returns Validity.Pending if one item is 
  pending and there are no invalid items.`, () => {
    expect(
      ValidityUtils.minValidity([
        Validity.Valid,
        Validity.Caution,
        Validity.Pending,
      ]),
    ).toBe(Validity.Pending);
  });

  test(`ValidityUtils.minValidity() returns Validity.Caution if at least one 
  item is cautioned and no items are invalid or pending.`, () => {
    expect(ValidityUtils.minValidity([Validity.Caution, Validity.Valid])).toBe(
      Validity.Caution,
    );
  });

  test(`ValidityUtils.minValidity() returns Validity.Valid if all items are 
  valid.`, () => {
    expect(ValidityUtils.minValidity([Validity.Valid])).toBe(Validity.Valid);
  });

  test(`ValidityUtils.minValidity() returns Validity.Valid if it receives an 
  empty array.`, () => {
    expect(ValidityUtils.minValidity([])).toBe(Validity.Valid);
  });

  test(`ValidityUtils.minValidity() removes entries whose validitySource is 
  GroupValiditySource.Reduction if opts.pruneUnvalidatedGroups is 
  true.`, () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const group = new Group({
      name: '',
      members: [requiredField],
    });

    const groupState = {
      value: {},
      validity: Validity.Pending,
      validitySource: GroupValiditySource.Reduction,
      messages: [],
    };

    expect(
      ValidityUtils.minValidity([group, groupState, Validity.Valid], {
        pruneUnvalidatedGroups: true,
      }),
    ).toBe(Validity.Valid);
  });

  test(`ValidityUtils.minValidity() does not remove entries whose validitySource 
  is GroupValiditySource.Reduction if opts.pruneUnvalidatedGroups is 
  false.`, () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const group = new Group({
      name: '',
      members: [requiredField],
    });

    const groupState = {
      value: {},
      validity: Validity.Pending,
      validitySource: GroupValiditySource.Reduction,
      messages: [],
    };

    expect(
      ValidityUtils.minValidity([group, groupState, Validity.Valid], {
        pruneUnvalidatedGroups: false,
      }),
    ).toBe(Validity.Invalid);
  });

  test(`ValidityUtils.minValidity() does not remove entries whose validitySource 
  is GroupValiditySource.Reduction if opts.pruneUnvalidatedGroups is 
  undefined.`, () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const group = new Group({
      name: '',
      members: [requiredField],
    });

    const groupState = {
      value: {},
      validity: Validity.Pending,
      validitySource: GroupValiditySource.Reduction,
      messages: [],
    };

    expect(ValidityUtils.minValidity([group, groupState, Validity.Valid])).toBe(
      Validity.Invalid,
    );
  });
});
