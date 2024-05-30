/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { describe, test, expect } from 'vitest';
import {
  ControlledExcludableField,
  ExcludableField,
  StringValidators,
  Validity,
  AsyncValidator,
  Field,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';
import type { ExcludableFieldState } from '../../../model/form-elements/classes/excludable-field';

describe('ControlledExcludableField', () => {
  test(`Upon instantiation, its initFn is called and its value and exclude 
  properties are initialized with the result.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
      excludeByDefault: true,
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
    });

    expect(controlled.state.value).toBe('test');
    expect(controlled.state.exclude).toBe(true);
  });

  test(`When setValue() is called and it has no async validators, its value,
  validity and messages are set to the result of its sync validators and
  hasBeenModified becomes true.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: '',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
      validators: [
        StringValidators.required({
          invalidMessage: 'Field is required.',
          validMessage: 'Field is valid.',
        }),
      ],
    });

    expect(controlled.state).toStrictEqual({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Field is required.',
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      hasBeenModified: false,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    controlled.setValue('test');

    expect(controlled.state).toStrictEqual({
      value: 'test',
      validity: Validity.Valid,
      messages: [
        {
          text: 'Field is valid.',
          validity: Validity.Valid,
        },
      ],
      exclude: false,
      hasBeenModified: true,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When setValue() is called and it has async validators, but its sync
  validators return an invalid result, its value, validity, and messages are
  set to that result.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
      validators: [
        StringValidators.required({
          invalidMessage: 'Field is required.',
        }),
      ],
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: value =>
            promiseScheduler.createScheduledPromise(/[A-Z]/.test(value)),
        }),
      ],
      pendingMessage: 'Validating field...',
      delayAsyncValidatorExecution: 0,
    });

    expect(controlled.state).toStrictEqual({
      value: 'test',
      validity: Validity.Pending,
      messages: [
        {
          text: 'Validating field...',
          validity: Validity.Pending,
        },
      ],
      exclude: false,
      hasBeenModified: false,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    controlled.setValue('');

    expect(controlled.state).toStrictEqual({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Field is required.',
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      hasBeenModified: true,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When setValue() is called, if it has async validators and its sync
  validators return a valid result, its validity becomes pending until the
  async validators resolve.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: '',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
      validators: [
        StringValidators.required({
          invalidMessage: 'Field is required.',
        }),
      ],
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: value =>
            promiseScheduler.createScheduledPromise(/[A-Z]/.test(value)),
          validMessage: 'Field is valid.',
        }),
      ],
      pendingMessage: 'Validating field...',
      delayAsyncValidatorExecution: 0,
    });

    expect(controlled.state).toStrictEqual({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Field is required.',
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      hasBeenModified: false,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    controlled.setValue('TEST');

    expect(controlled.state).toStrictEqual({
      value: 'TEST',
      validity: Validity.Pending,
      messages: [
        {
          text: 'Validating field...',
          validity: Validity.Pending,
        },
      ],
      exclude: false,
      hasBeenModified: true,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    controlled.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: 'TEST',
        validity: Validity.Valid,
        messages: [
          {
            text: 'Field is valid.',
            validity: Validity.Valid,
          },
        ],
        exclude: false,
        hasBeenModified: true,
        isInFocus: false,
        hasBeenBlurred: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    promiseScheduler.resolveAll();
  });

  test(`When the state of its controller changes, its controlFn is called. If
  that function returns an object containing a value, its value is updated and
  pending async validators are unsubscribed from.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'TEST',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
      validators: [
        StringValidators.required({
          invalidMessage: 'Field is required.',
        }),
      ],
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: value =>
            promiseScheduler.createScheduledPromise(/[A-Z]/.test(value)),
          validMessage: 'Field is valid.',
        }),
      ],
      pendingMessage: 'Validating field...',
      delayAsyncValidatorExecution: 0,
    });

    expect(controlled.state).toStrictEqual({
      value: 'TEST',
      validity: Validity.Pending,
      messages: [
        {
          text: 'Validating field...',
          validity: Validity.Pending,
        },
      ],
      exclude: false,
      hasBeenModified: false,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    controller.setValue('');

    promiseScheduler.resolveAll();

    expect(controlled.state).toStrictEqual({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Field is required.',
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      hasBeenModified: false,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When the state of its controller changes, its controlFn is called. If
  that function returns an object containing 'exclude,' its own state.exclude
  property is updated.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
    });

    expect(controlled.state.exclude).toBe(false);

    controller.setExclude(true);

    expect(controlled.state.exclude).toBe(true);
  });

  test(`When the state of its controller changes, its controlFn is called. If
  that function returns an object that does not contain a value, its own value
  is not updated.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: '',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude, didPropertyChange }) => {
        if (!didPropertyChange('value')) {
          return {
            exclude,
          };
        }

        return {
          value,
          exclude,
        };
      },
    });

    controlled.setValue('test');

    controller.setExclude(true);

    expect(controlled.state.value).toBe('test');
  });

  test(`When the state of its controller changes, its controlFn is called. If 
  that function returns an object include 'value' but not 'exclude,' its value 
  is updated.`, () => {
    const controller = new Field({
      name: 'controller',
      defaultValue: '',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value }) => {
        return {
          value,
          exclude: false,
        };
      },
      controlFn: ({ value }) => ({ value }),
    });

    controller.setValue('test');
    expect(controlled.state.value).toBe('test');
  });

  test(`When the state of its controller changes, its controlFn is called. If
  that function returns void, its state is not changed.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: '',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude, didPropertyChange }) => {
        if (!didPropertyChange('value') && !didPropertyChange('exclude')) {
          return;
        }

        if (!didPropertyChange('value')) {
          return {
            exclude,
          };
        }

        return {
          value,
          exclude,
        };
      },
    });

    controlled.setValue('test');
    controlled.setExclude(true);

    controller.focus();

    expect(controlled.state.value).toBe('test');
    expect(controlled.state.exclude).toBe(true);
  });

  test(`When focus() is called, isInFocus becomes true and didPropertyChange()
  returns true for 'isInFocus' if the field was not already focused. 
  didPropertyChange() returns false for all other properties.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
    });

    controlled.focus();

    expect(controlled.state.isInFocus).toBe(true);
    expect(controlled.state.didPropertyChange('isInFocus')).toBe(true);

    for (const key of Object.keys(controlled.state).filter(
      k => k !== 'isInFocus' && k !== 'didPropertyChange',
    )) {
      expect(
        controlled.state.didPropertyChange(
          key as keyof ExcludableFieldState<string>,
        ),
      ).toBe(false);
    }

    controlled.focus();
    controlled.focus();

    expect(controlled.state.didPropertyChange('isInFocus')).toBe(false);
  });

  test(`When cancelFocus() is called, isInFocus becomes false and
  didPropertyChange() returns true for 'isInFocus' if the field is not already
  out of focus, and false for all other
  properties.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
    });

    controlled.focus();

    expect(controlled.state.isInFocus).toBe(true);
    expect(controlled.state.didPropertyChange('isInFocus')).toBe(true);

    controlled.cancelFocus();

    expect(controlled.state.isInFocus).toBe(false);
    expect(controlled.state.didPropertyChange('isInFocus')).toBe(true);

    for (const key of Object.keys(controlled.state).filter(
      k => k !== 'isInFocus' && k !== 'didPropertyChange',
    )) {
      expect(
        controlled.state.didPropertyChange(
          key as keyof ExcludableFieldState<string>,
        ),
      ).toBe(false);
    }

    controlled.focus();
    controlled.cancelFocus();
    controlled.cancelFocus();

    expect(controlled.state.didPropertyChange('isInFocus')).toBe(false);
  });

  test(`When blur() is called, isInFocus becomes false. The first time,
  hasBeenBlurred becomes true and didPropertyChange() returns true for both
  isInFocus and hasBeenBlurred. On subsequent calls, didPropertyChange() returns
  true for isInFocus if the field is not already out of focus but false for 
  hasBeenBlurred.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
    });

    controlled.focus();
    controlled.blur();

    expect(controlled.state.isInFocus).toBe(false);
    expect(controlled.state.hasBeenBlurred).toBe(true);
    expect(controlled.state.didPropertyChange('isInFocus')).toBe(true);
    expect(controlled.state.didPropertyChange('hasBeenBlurred')).toBe(true);

    controlled.focus();
    controlled.blur();

    expect(controlled.state.didPropertyChange('isInFocus')).toBe(true);
    expect(controlled.state.didPropertyChange('hasBeenBlurred')).toBe(false);

    controlled.blur();

    expect(controlled.state.didPropertyChange('isInFocus')).toBe(false);
  });

  test(`When setSubmitted() is called, submitted becomes true and
  didPropertyChange() returns true for 'submitted' and false for all other
  properties. On subsequent calls, didPropertyChange() returns false for
  submitted.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
    });

    expect(controlled.state.submitted).toBe(false);
    expect(controlled.state.didPropertyChange('submitted')).toBe(false);

    controlled.setSubmitted();
    expect(controlled.state.submitted).toBe(true);
    expect(controlled.state.didPropertyChange('submitted')).toBe(true);

    for (const key of Object.keys(controlled.state).filter(
      k => k !== 'submitted' && k !== 'didPropertyChange',
    )) {
      expect(
        controlled.state.didPropertyChange(
          key as keyof ExcludableFieldState<string>,
        ),
      ).toBe(false);
    }

    controlled.setSubmitted();
    expect(controlled.state.didPropertyChange('submitted')).toBe(false);
  });

  test(`When setExclude() is called, its exclude property is updated and
  didPropertyChange() returns true if the value passed to setExclude() is
  different than the current value of exclude. didPropertyChange() returns false
  for all other properties.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
    });

    expect(controlled.state.exclude).toBe(false);
    expect(controlled.state.didPropertyChange('exclude')).toBe(false);

    controlled.setExclude(true);

    expect(controlled.state.exclude).toBe(true);
    expect(controlled.state.didPropertyChange('exclude')).toBe(true);

    for (const key of Object.keys(controlled.state).filter(
      k => k !== 'exclude' && k !== 'didPropertyChange',
    )) {
      expect(
        controlled.state.didPropertyChange(
          key as keyof ExcludableFieldState<string>,
        ),
      ).toBe(false);
    }

    controlled.setExclude(true);
    expect(controlled.state.didPropertyChange('exclude')).toBe(false);
  });

  test(`Async validators execute upon instantiation if sync validators 
  pass.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: '',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: value =>
            promiseScheduler.createScheduledPromise(value.length > 0),
          invalidMessage: 'Field is invalid.',
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    controlled.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: '',
        validity: Validity.Invalid,
        messages: [
          {
            text: 'Field is invalid.',
            validity: Validity.Invalid,
          },
        ],
        exclude: false,
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    promiseScheduler.resolveAll();
  });

  test(`Async validators execute when reset() is called if sync validators
  pass.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
      validators: [
        StringValidators.required({
          invalidMessage: 'Field is required.',
        }),
      ],
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: value =>
            promiseScheduler.createScheduledPromise(/[A-Z]/.test(value)),
          invalidMessage: 'Field must contain an uppercase letter.',
        }),
      ],
      delayAsyncValidatorExecution: 0,
      pendingMessage: 'Validating field...',
    });

    controlled.setValue('');

    expect(controlled.state).toStrictEqual({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Field is required.',
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      hasBeenModified: true,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    controlled.reset();

    expect(controlled.state).toStrictEqual({
      value: 'test',
      validity: Validity.Pending,
      messages: [
        {
          text: 'Validating field...',
          validity: Validity.Pending,
        },
      ],
      exclude: false,
      hasBeenModified: false,
      isInFocus: false,
      hasBeenBlurred: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    controlled.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: 'test',
        validity: Validity.Invalid,
        messages: [
          {
            text: 'Field must contain an uppercase letter.',
            validity: Validity.Invalid,
          },
        ],
        exclude: false,
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    promiseScheduler.resolveAll();
  });

  test(`Async validators execute when the state of the controller changes if
  the controlFn produces a value and sync validators pass.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: value =>
            promiseScheduler.createScheduledPromise(/[A-Z]/.test(value)),
          validMessage: 'Field contains an uppercase letter.',
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    controller.setValue('TEST');

    controlled.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: 'TEST',
        validity: Validity.Valid,
        messages: [
          {
            text: 'Field contains an uppercase letter.',
            validity: Validity.Valid,
          },
        ],
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        exclude: false,
        didPropertyChange: expect.any(Function),
      });
    });

    promiseScheduler.resolveAll();
  });

  test(`When reset() is called, pending async validators are unsubscribed 
  from.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: '',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      controller,
      initFn: ({ value, exclude }) => ({ value, exclude }),
      controlFn: ({ value, exclude }) => ({ value, exclude }),
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: value =>
            promiseScheduler.createScheduledPromise(/[A-Z]/.test(value)),
          validMessage: 'Field contains an uppercase letter.',
          invalidMessage: 'Field must contain an uppercase letter.',
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    controlled.setValue('A');

    controlled.reset();

    controlled.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: '',
        validity: Validity.Invalid,
        messages: [
          {
            text: 'Field must contain an uppercase letter.',
            validity: Validity.Invalid,
          },
        ],
        exclude: false,
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    promiseScheduler.resolveAll();
  });
});
