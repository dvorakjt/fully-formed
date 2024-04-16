import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { PromiseScheduler } from '../../test-utils';
import { useGroupValidation } from '../../hooks';
import { Field, Group, StringValidators, Validity } from '../../model';

describe('useGroupValidation()', () => {
  afterEach(cleanup);

  test(`If a single group is invalid and has a validity source of validation,
  it returns Validity.Invalid.`, () => {
    const fieldA = new Field({
      name: 'fieldA',
      defaultValue: '',
    });
    const fieldB = new Field({
      name: 'fieldB',
      defaultValue: '',
    });
    const invalidDueToValidation = new Group({
      name: 'AB',
      members: [fieldA, fieldB],
      validatorTemplates: [
        {
          predicate: (): boolean => false,
        },
      ],
    });

    const promiseScheduler = new PromiseScheduler();

    const fieldC = new Field({
      name: 'fieldC',
      defaultValue: '',
    });
    const fieldD = new Field({
      name: 'fieldD',
      defaultValue: '',
    });
    const pendingDueToValidation = new Group({
      name: 'CD',
      members: [fieldC, fieldD],
      asyncValidatorTemplates: [
        {
          predicate: (): Promise<boolean> => {
            return promiseScheduler.createScheduledPromise(true);
          },
        },
      ],
    });

    const fieldE = new Field({
      name: 'fieldE',
      defaultValue: '',
    });
    const fieldF = new Field({
      name: 'fieldF',
      defaultValue: '',
    });
    const valid = new Group({
      name: 'EF',
      members: [fieldE, fieldF],
    });

    function TestComponent(): React.ReactNode {
      const groupValidity = useGroupValidation(
        invalidDueToValidation,
        pendingDueToValidation,
        valid,
      );

      return <p>{groupValidity}</p>;
    }

    render(<TestComponent />);
    expect(screen.queryByText(Validity.Invalid)).not.toBeNull();
  });

  test(`If no groups with a validity source of validation are invalid, but there
  is at least one group whose validity source is validation and whose validity
  is pending, it returns Validity.Pending.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const fieldA = new Field({
      name: 'fieldA',
      defaultValue: '',
    });
    const fieldB = new Field({
      name: 'fieldB',
      defaultValue: '',
    });
    const pendingDueToValidation = new Group({
      name: 'AB',
      members: [fieldA, fieldB],
      asyncValidatorTemplates: [
        {
          predicate: (): Promise<boolean> => {
            return promiseScheduler.createScheduledPromise(true);
          },
        },
      ],
    });

    const fieldC = new Field({
      name: 'fieldC',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const fieldD = new Field({
      name: 'fieldD',
      defaultValue: '',
    });
    const invalidDueToReduction = new Group({
      name: 'CD',
      members: [fieldC, fieldD],
    });

    const fieldE = new Field({
      name: 'fieldE',
      defaultValue: '',
    });
    const fieldF = new Field({
      name: 'fieldF',
      defaultValue: '',
    });
    const valid = new Group({
      name: 'EF',
      members: [fieldE, fieldF],
    });

    function TestComponent(): React.ReactNode {
      const groupValidity = useGroupValidation(
        pendingDueToValidation,
        invalidDueToReduction,
        valid,
      );

      return <p>{groupValidity}</p>;
    }

    render(<TestComponent />);
    expect(screen.queryByText(Validity.Pending)).not.toBeNull();
  });

  test(`If no groups with a validity source of validition are invalid or
  pending, it returns Validity.Valid.`, () => {
    const fieldA = new Field({
      name: 'fieldA',
      defaultValue: '',
    });
    const fieldB = new Field({
      name: 'fieldB',
      defaultValue: '',
    });
    const valid = new Group({
      name: 'AB',
      members: [fieldA, fieldB],
    });

    const fieldC = new Field({
      name: 'fieldC',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const fieldD = new Field({
      name: 'fieldD',
      defaultValue: '',
    });
    const invalidDueToReduction = new Group({
      name: 'CD',
      members: [fieldC, fieldD],
    });

    const promiseScheduler = new PromiseScheduler();

    const fieldE = new Field({
      name: 'fieldE',
      defaultValue: '',
      asyncValidatorTemplates: [
        {
          predicate: (): Promise<boolean> =>
            promiseScheduler.createScheduledPromise(true),
        },
      ],
    });
    const fieldF = new Field({
      name: 'fieldF',
      defaultValue: '',
    });
    const pendingDueToReduction = new Group({
      name: 'EF',
      members: [fieldE, fieldF],
    });

    function TestComponent(): React.ReactNode {
      const groupValidity = useGroupValidation(
        valid,
        invalidDueToReduction,
        pendingDueToReduction,
      );

      return <p>{groupValidity}</p>;
    }

    render(<TestComponent />);
    expect(screen.queryByText(Validity.Valid)).not.toBeNull();
  });

  test(`If a single group becomes invalid because of validation, the validity
  it returned is updated and becomes Validity.Invalid.`, async () => {
    const fieldA = new Field({
      name: 'fieldA',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const fieldB = new Field({
      name: 'fieldB',
      defaultValue: '',
    });
    const willBecomeInvalidDueToValidation = new Group({
      name: 'AB',
      members: [fieldA, fieldB],
      validatorTemplates: [
        {
          predicate: (): boolean => false,
        },
      ],
    });

    const promiseScheduler = new PromiseScheduler();

    const fieldC = new Field({
      name: 'fieldC',
      defaultValue: '',
    });
    const fieldD = new Field({
      name: 'fieldD',
      defaultValue: '',
    });
    const pendingDueToValidation = new Group({
      name: 'CD',
      members: [fieldC, fieldD],
      asyncValidatorTemplates: [
        {
          predicate: (): Promise<boolean> => {
            return promiseScheduler.createScheduledPromise(true);
          },
        },
      ],
    });

    const fieldE = new Field({
      name: 'fieldE',
      defaultValue: '',
    });
    const fieldF = new Field({
      name: 'fieldF',
      defaultValue: '',
    });
    const valid = new Group({
      name: 'EF',
      members: [fieldE, fieldF],
    });

    function TestComponent(): React.ReactNode {
      const groupValidity = useGroupValidation(
        willBecomeInvalidDueToValidation,
        pendingDueToValidation,
        valid,
      );

      return <p>{groupValidity}</p>;
    }

    render(<TestComponent />);
    expect(screen.queryByText(Validity.Pending)).not.toBeNull();

    fieldA.setValue('test');
    await waitFor(() =>
      expect(screen.queryByText(Validity.Invalid)).not.toBeNull(),
    );
    expect(screen.queryByText(Validity.Pending)).toBeNull();
  });

  test(`If no groups with a validity source of validation are invalid, and a
  single group becomes pending because of validation, the validity it
  returned is updated and becomes Validity.Pending.`, async () => {
    const promiseScheduler = new PromiseScheduler();

    const fieldA = new Field({
      name: 'fieldA',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const fieldB = new Field({
      name: 'fieldB',
      defaultValue: '',
    });
    const willBecomePendingDueToValidation = new Group({
      name: 'AB',
      members: [fieldA, fieldB],
      asyncValidatorTemplates: [
        {
          predicate: (): Promise<boolean> => {
            return promiseScheduler.createScheduledPromise(true);
          },
        },
      ],
    });

    const fieldC = new Field({
      name: 'fieldC',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const fieldD = new Field({
      name: 'fieldD',
      defaultValue: '',
    });
    const invalidDueToReduction = new Group({
      name: 'CD',
      members: [fieldC, fieldD],
    });

    const fieldE = new Field({
      name: 'fieldE',
      defaultValue: '',
    });
    const fieldF = new Field({
      name: 'fieldF',
      defaultValue: '',
    });
    const valid = new Group({
      name: 'EF',
      members: [fieldE, fieldF],
    });

    function TestComponent(): React.ReactNode {
      const groupValidity = useGroupValidation(
        willBecomePendingDueToValidation,
        invalidDueToReduction,
        valid,
      );

      return <p>{groupValidity}</p>;
    }

    render(<TestComponent />);
    expect(screen.queryByText(Validity.Valid)).not.toBeNull();

    fieldA.setValue('test');
    await waitFor(() =>
      expect(screen.queryByText(Validity.Pending)).not.toBeNull(),
    );
    expect(screen.queryByText(Validity.Valid)).toBeNull();
  });
});
