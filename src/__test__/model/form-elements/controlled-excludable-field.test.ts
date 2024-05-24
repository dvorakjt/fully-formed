import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  ControlledExcludableField,
  ExcludableField,
  type ExcludableState,
  Field,
  StringValidators,
  Validity,
  type MessageBearerState,
  type ValidatedState,
  StateManager,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';

type ControlledState<T> =
  | (ValidatedState<T> & MessageBearerState & ExcludableState)
  | (ValidatedState<T> & MessageBearerState)
  | ExcludableState;

describe('ControlledField', () => {
  test(`Upon instantiation, it calls its controlFn with the state of its 
  controller and its value, validity, messages, and exclude are set to the 
  result.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
      validators: [
        StringValidators.required({
          validMessage: 'Field is valid.',
        }),
      ],
      excludeByDefault: true,
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      defaultValue: '',
      excludeByDefault: false,
      controller,
      controlFn: (state): ControlledState<string> => ({
        value: state.value,
        validity: state.validity,
        messages: state.messages,
        exclude: state.exclude,
      }),
    });

    expect(controlled.state).toStrictEqual({
      value: 'test',
      validity: Validity.Valid,
      messages: [
        {
          text: 'Field is valid.',
          validity: Validity.Valid,
        },
      ],
      exclude: true,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });
  });

  test(`Upon instantiation, if its controlFn returns a state object whose 
  only property is "exclude," its state.exclude property is set to the value 
  of that property, but its value, validity and messages are initialized to its 
  default value and a corresponding validator result.`, () => {
    const select = new Field({
      name: 'select',
      defaultValue: '',
    });

    const other = new ControlledExcludableField({
      name: 'other',
      defaultValue: '',
      controller: select,
      controlFn: (state): ExcludableState => ({
        exclude: state.value !== 'other',
      }),
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter another option.',
        }),
      ],
    });

    expect(other.state).toStrictEqual({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Please enter another option.',
          validity: Validity.Invalid,
        },
      ],
      exclude: true,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });
  });

  test(`Upon instantiation, if its controlFn does not return a state object, its
  value, validity, messages are initialized to its default value and a 
  corresponding validator result. Its state.exclude property is initialized to 
  excludeByDefault.`, () => {
    const controller = new Field({
      name: 'controller',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      defaultValue: 'test',
      validators: [
        StringValidators.required({
          validMessage: 'Field is valid.',
        }),
      ],
      excludeByDefault: true,
      controller,
      controlFn: (state): ControlledState<string> | void => {
        if (state.validity !== Validity.Valid) return;

        return {
          value: state.value,
          validity: state.validity,
          messages: state.messages,
        };
      },
    });

    expect(controlled.state).toStrictEqual({
      value: 'test',
      validity: Validity.Valid,
      messages: [
        {
          text: 'Field is valid.',
          validity: Validity.Valid,
        },
      ],
      exclude: true,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });
  });

  test(`When the state of its controller changes, it calls its controlFn and
  updates its own state accordingly.`, () => {
    const controller = new StateManager<
      ValidatedState<string> & MessageBearerState & ExcludableState
    >({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Field is required.',
          validity: Validity.Invalid,
        },
      ],
      exclude: true,
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      defaultValue: '',
      excludeByDefault: false,
      controller,
      controlFn: (state): ControlledState<string> => ({
        value: state.value,
        validity: state.validity,
        messages: state.messages,
        exclude: state.exclude,
      }),
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
      exclude: true,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });

    controller.state = {
      value: 'test',
      validity: Validity.Valid,
      messages: [
        {
          text: 'Field is valid.',
          validity: Validity.Valid,
        },
      ],
      exclude: false,
    };

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
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });
  });

  test(`When the state of its controller changes, it calls its controlFn, and if
  that function returns a state object with only an "exclude" property, only
  that property of state is updated.`, () => {
    const select = new Field({
      name: 'select',
      defaultValue: '',
    });

    const other = new ControlledExcludableField({
      name: 'other',
      defaultValue: '',
      controller: select,
      controlFn: (state): ExcludableState => ({
        exclude: state.value !== 'other',
      }),
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter another option.',
        }),
      ],
    });

    expect(other.state).toStrictEqual({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Please enter another option.',
          validity: Validity.Invalid,
        },
      ],
      exclude: true,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });

    select.setValue('other');

    expect(other.state).toStrictEqual({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: 'Please enter another option.',
          validity: Validity.Invalid,
        },
      ],
      exclude: false,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });
  });

  test(`When the state of its controller changes, it calls its controlFn and if
  that function does not return a state object, its state remains
  unchanged.`, () => {
    const controller = new Field({
      name: 'controller',
      defaultValue: 'test',
      validators: [
        StringValidators.required({
          invalidMessage: 'Field is required.',
          validMessage: 'Field is valid.',
        }),
      ],
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      defaultValue: '',
      controller,
      controlFn: (state): ControlledState<string> | void => {
        if (state.validity !== Validity.Valid) return;

        return {
          value: state.value,
          validity: state.validity,
          messages: state.messages,
        };
      },
    });

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
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });

    controller.setValue('');

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
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });
  });

  test(`When reset() is called, it calls its controlFn and if that function
  returns a state object, its state is updated.`, () => {
    const controller = new ExcludableField({
      name: 'controller',
      defaultValue: 'test',
      validators: [
        StringValidators.required({
          validMessage: 'Field is valid.',
        }),
      ],
      excludeByDefault: true,
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      defaultValue: '',
      excludeByDefault: false,
      controller,
      controlFn: (state): ControlledState<string> => ({
        value: state.value,
        validity: state.validity,
        messages: state.messages,
        exclude: state.exclude,
      }),
      validators: [
        StringValidators.required({
          invalidMessage: 'Field is required.',
        }),
      ],
    });

    controlled.setValue('');
    controlled.setExclude(false);

    controlled.reset();

    expect(controlled.state).toStrictEqual({
      value: 'test',
      validity: Validity.Valid,
      messages: [
        {
          text: 'Field is valid.',
          validity: Validity.Valid,
        },
      ],
      exclude: true,
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    });
  });

  test(`When its controlFn is called and it returns a state object that includes 
  value, validity and messages properties, pending async validators are 
  unsubscribed from.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new Field({
      name: 'controller',
      defaultValue: 'controller value',
    });

    const controlled = new ControlledExcludableField({
      name: 'controlled',
      defaultValue: '',
      controller,
      controlFn: ({ value }): ValidatedState<string> & MessageBearerState => ({
        value,
        validity: Validity.Valid,
        messages: [
          {
            text: 'Field is valid.',
            validity: Validity.Valid,
          },
        ],
      }),
      asyncValidators: [
        new AsyncValidator<string>({
          predicate: (): Promise<boolean> => {
            return promiseScheduler.createScheduledPromise(false);
          },
          invalidMessage: 'Field is invalid.',
        }),
      ],
      delayAsyncValidatorExecution: 0,
    });

    promiseScheduler.resolveAll();

    expect(controlled.state.value).toBe('controller value');
    expect(controlled.state.validity).toBe(Validity.Valid);
    expect(controlled.state.messages).toStrictEqual([
      {
        text: 'Field is valid.',
        validity: Validity.Valid,
      },
    ]);
  });
});
