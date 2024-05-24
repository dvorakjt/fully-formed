import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  ControlledField,
  Field,
  StringValidators,
  Validity,
  type MessageBearerState,
  type NonTransientField,
  type ValidatedState,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';

describe('ControlledField', () => {
  const complementaryColors = {
    red: 'green',
    blue: 'orange',
    yellow: 'purple',
    green: 'red',
    orange: 'blue',
    purple: 'yellow',
  };

  test(`Upon instantiation, it calls its controlFn with the state of its 
  controller and its value, validity and messages are set to the result.`, () => {
    const brandPrimary: NonTransientField<
      'brandPrimary',
      keyof typeof complementaryColors
    > = new Field({
      name: 'brandPrimary',
      defaultValue: 'red',
    });

    const brandSecondary = new ControlledField({
      name: 'brandSecondary',
      defaultValue: '',
      controller: brandPrimary,
      controlFn: ({ value }): ValidatedState<string> & MessageBearerState => ({
        value: complementaryColors[value],
        validity: Validity.Valid,
        messages: [],
      }),
    });

    expect(brandSecondary.state.value).toBe(
      complementaryColors[brandPrimary.state.value],
    );
  });

  test(`Upon instantiation, if its controlFn does not return a state object, its
  value, validity and messages are initialized to its default value and a 
  corresponding validator result.`, () => {
    const brandPrimary = new Field({
      name: 'brandPrimary',
      defaultValue: '',
    });

    const brandSecondary = new ControlledField({
      name: 'brandSecondary',
      defaultValue: '',
      controller: brandPrimary,
      controlFn: ({
        value,
      }): (ValidatedState<string> & MessageBearerState) | void => {
        if (!(value in complementaryColors)) return;

        return {
          value: complementaryColors[value as keyof typeof complementaryColors],
          validity: Validity.Valid,
          messages: [],
        };
      },
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter a secondary color.',
        }),
      ],
    });

    expect(brandSecondary.state.value).toBe('');
    expect(brandSecondary.state.validity).toBe(Validity.Invalid);
    expect(brandSecondary.state.messages).toStrictEqual([
      {
        text: 'Please enter a secondary color.',
        validity: Validity.Invalid,
      },
    ]);
  });

  test(`When the state of its controller changes, it calls its controlFn and 
  updates its own state accordingly.`, () => {
    const brandPrimary = new Field({
      name: 'brandPrimary',
      defaultValue: '',
    });

    const brandSecondary = new ControlledField({
      name: 'brandSecondary',
      defaultValue: '',
      controller: brandPrimary,
      controlFn: ({
        value,
      }): (ValidatedState<string> & MessageBearerState) | void => {
        if (!(value in complementaryColors)) return;

        return {
          value: complementaryColors[value as keyof typeof complementaryColors],
          validity: Validity.Valid,
          messages: [],
        };
      },
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter a secondary color.',
        }),
      ],
    });

    expect(brandSecondary.state.value).toBe('');
    expect(brandSecondary.state.validity).toBe(Validity.Invalid);
    expect(brandSecondary.state.messages).toStrictEqual([
      {
        text: 'Please enter a secondary color.',
        validity: Validity.Invalid,
      },
    ]);

    brandPrimary.setValue('red');

    expect(brandSecondary.state.value).toBe('green');
    expect(brandSecondary.state.validity).toBe(Validity.Valid);
    expect(brandSecondary.state.messages).toStrictEqual([]);
  });

  test(`When the state of its controller changes, it calls its controlFn and if 
  that control fn does not return a state object, its state remains 
  unchanged.`, () => {
    const brandPrimary = new Field({
      name: 'brandPrimary',
      defaultValue: 'red',
    });

    const brandSecondary = new ControlledField({
      name: 'brandSecondary',
      defaultValue: '',
      controller: brandPrimary,
      controlFn: ({
        value,
      }): (ValidatedState<string> & MessageBearerState) | void => {
        if (!(value in complementaryColors)) return;

        return {
          value: complementaryColors[value as keyof typeof complementaryColors],
          validity: Validity.Valid,
          messages: [],
        };
      },
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter a secondary color.',
        }),
      ],
    });

    expect(brandSecondary.state.value).toBe('green');
    expect(brandSecondary.state.validity).toBe(Validity.Valid);
    expect(brandSecondary.state.messages).toStrictEqual([]);

    brandPrimary.setValue('');

    expect(brandSecondary.state.value).toBe('green');
    expect(brandSecondary.state.validity).toBe(Validity.Valid);
    expect(brandSecondary.state.messages).toStrictEqual([]);
  });

  test(`When reset() is called, it calls its controlFn and if that function 
  returns a state object, its state is updated.`, () => {
    const brandPrimary = new Field({
      name: 'brandPrimary',
      defaultValue: 'green',
    });

    const brandSecondary = new ControlledField({
      name: 'brandSecondary',
      defaultValue: '',
      controller: brandPrimary,
      controlFn: ({
        value,
      }): (ValidatedState<string> & MessageBearerState) | void => {
        if (!(value in complementaryColors)) return;

        return {
          value: complementaryColors[value as keyof typeof complementaryColors],
          validity: Validity.Valid,
          messages: [],
        };
      },
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter a secondary color.',
        }),
      ],
    });

    brandSecondary.setValue('aquamarine');
    expect(brandSecondary.state.value).toBe('aquamarine');
    expect(brandSecondary.state.validity).toBe(Validity.Valid);
    expect(brandSecondary.state.messages).toStrictEqual([]);

    brandSecondary.reset();
    expect(brandSecondary.state.value).toBe('red');
    expect(brandSecondary.state.validity).toBe(Validity.Valid);
    expect(brandSecondary.state.messages).toStrictEqual([]);
  });

  test(`When reset() is called, it calls its controlFn and if that function 
  does not return a state object, its value becomes its default value and its 
  validity and messages are set accordingly.`, () => {
    const brandPrimary = new Field({
      name: 'brandPrimary',
      defaultValue: '',
    });

    const brandSecondary = new ControlledField({
      name: 'brandSecondary',
      defaultValue: '',
      controller: brandPrimary,
      controlFn: ({
        value,
      }): (ValidatedState<string> & MessageBearerState) | void => {
        if (!(value in complementaryColors)) return;

        return {
          value: complementaryColors[value as keyof typeof complementaryColors],
          validity: Validity.Valid,
          messages: [],
        };
      },
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter a secondary color.',
        }),
      ],
    });

    brandSecondary.setValue('aquamarine');
    expect(brandSecondary.state.value).toBe('aquamarine');
    expect(brandSecondary.state.validity).toBe(Validity.Valid);
    expect(brandSecondary.state.messages).toStrictEqual([]);

    brandSecondary.reset();
    expect(brandSecondary.state.value).toBe('');
    expect(brandSecondary.state.validity).toBe(Validity.Invalid);
    expect(brandSecondary.state.messages).toStrictEqual([
      {
        text: 'Please enter a secondary color.',
        validity: Validity.Invalid,
      },
    ]);
  });

  test(`When its controlFn is called and it returns a state object, pending 
  async validators are unsubscribed from.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const controller = new Field({
      name: 'controller',
      defaultValue: 'controller value',
    });

    const controlled = new ControlledField({
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
