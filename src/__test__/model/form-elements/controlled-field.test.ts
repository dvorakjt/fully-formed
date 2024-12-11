/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { describe, test, expect, beforeEach } from 'vitest';
import {
  ControlledField,
  Field,
  Validator,
  Validity,
  type IAsyncValidator,
  type ValidatorResult,
  type FieldOfType,
  type FieldState,
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

  const colorsInStock = new Set<string>(['red', 'blue', 'green', 'orange']);

  const colorValidMessage = 'You have selected a valid color.';
  const colorInvalidMessage = 'Please select a valid color.';

  const colorValidator = new Validator<string>({
    predicate: (value): boolean => {
      return value in complementaryColors;
    },
    validMessage: colorValidMessage,
    invalidMessage: colorInvalidMessage,
  });

  const isInStockMessage = 'The color is in stock.';
  const isNotInStockMessage = 'The color is not in stock.';
  const pendingMessage = 'Checking quantity in stock...';

  class InStockValidator implements IAsyncValidator<string> {
    private promiseScheduler: PromiseScheduler = new PromiseScheduler();

    public validate(value: string): Promise<ValidatorResult> {
      const isValid = colorsInStock.has(value);

      return this.promiseScheduler.createScheduledPromise({
        validity: isValid ? Validity.Valid : Validity.Invalid,
        message: {
          text: isValid ? isInStockMessage : isNotInStockMessage,
          validity: isValid ? Validity.Valid : Validity.Invalid,
        },
      });
    }

    public resolve(): void {
      this.promiseScheduler.resolveAll();
    }
  }

  let colorInStockValidator: InStockValidator;
  let complementInStockValidator: InStockValidator;
  let color: FieldOfType<string>;
  let complement: ControlledField<
    'complement',
    string,
    FieldOfType<string>,
    false
  >;

  beforeEach(() => {
    colorInStockValidator = new InStockValidator();
    complementInStockValidator = new InStockValidator();
    color = new Field({
      name: 'color',
      defaultValue: 'red',
      validators: [colorValidator],
      asyncValidators: [colorInStockValidator],
      pendingMessage: pendingMessage,
      delayAsyncValidatorExecution: 0,
    });

    complement = new ControlledField({
      name: 'complement',
      controller: color,
      initFn: ({ value }) => {
        return value in complementaryColors ?
            complementaryColors[value as keyof typeof complementaryColors]
          : '';
      },
      controlFn: ({ value, didPropertyChange }) => {
        if (!(didPropertyChange('value') && value in complementaryColors)) {
          return;
        }

        return complementaryColors[value as keyof typeof complementaryColors];
      },
      validators: [colorValidator],
      asyncValidators: [complementInStockValidator],
      pendingMessage,
      delayAsyncValidatorExecution: 0,
    });
  });

  test(`Upon instantiation, it calls its initFn with the state of its
  controller. The resultant value is passed into its validators and the
  result becomes its initial state.`, () => {
    expect(complement.state).toStrictEqual({
      value: 'green',
      validity: Validity.Pending,
      messages: [
        {
          text: colorValidMessage,
          validity: Validity.Valid,
        },
        {
          text: pendingMessage,
          validity: Validity.Pending,
        },
      ],
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    complement.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: 'green',
        validity: Validity.Valid,
        messages: [
          {
            text: colorValidMessage,
            validity: Validity.Valid,
          },
          {
            text: isInStockMessage,
            validity: Validity.Valid,
          },
        ],
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    complementInStockValidator.resolve();
  });

  test(`When setValue() is called and it has no async validators, its value,
  validity and messages are set to the result of its sync validators and
  hasBeenModified becomes true.`, () => {
    const syncOnlyComplement = new ControlledField({
      name: 'complement',
      controller: color,
      initFn: ({ value }) => {
        return value in complementaryColors ?
            complementaryColors[value as keyof typeof complementaryColors]
          : '';
      },
      controlFn: ({ value, didPropertyChange }) => {
        if (!(didPropertyChange('value') && value in complementaryColors))
          return;

        return value in complementaryColors ?
            complementaryColors[value as keyof typeof complementaryColors]
          : '';
      },
      validators: [colorValidator],
    });

    syncOnlyComplement.setValue('orange');

    expect(syncOnlyComplement.state).toStrictEqual({
      value: 'orange',
      validity: Validity.Valid,
      messages: [
        {
          text: colorValidMessage,
          validity: Validity.Valid,
        },
      ],
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When setValue() is called and it has async validators, but its sync
  validators return an invalid result, its value, validity, and messages are
  set to that result.`, () => {
    const color = new Field({
      name: 'color',
      defaultValue: 'red',
      validators: [colorValidator],
      asyncValidators: [new InStockValidator()],
      delayAsyncValidatorExecution: 0,
    });

    const complement = new ControlledField({
      name: 'complement',
      controller: color,
      initFn: ({ value }) => {
        return value in complementaryColors ?
            complementaryColors[value as keyof typeof complementaryColors]
          : '';
      },
      controlFn: ({ value, didPropertyChange }) => {
        if (!(didPropertyChange('value') && value in complementaryColors))
          return;

        return value in complementaryColors ?
            complementaryColors[value as keyof typeof complementaryColors]
          : '';
      },
      validators: [colorValidator],
      asyncValidators: [new InStockValidator()],
      pendingMessage,
      delayAsyncValidatorExecution: 0,
    });

    complement.setValue('pizza');

    expect(complement.state).toStrictEqual({
      value: 'pizza',
      validity: Validity.Invalid,
      messages: [
        {
          text: colorInvalidMessage,
          validity: Validity.Invalid,
        },
      ],
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });
  });

  test(`When setValue() is called, if it has async validators and its sync
  validators return a valid result, its validity becomes pending until the
  async validators resolve.`, () => {
    complement.setValue('orange');

    expect(complement.state).toStrictEqual({
      value: 'orange',
      validity: Validity.Pending,
      messages: [
        {
          text: colorValidMessage,
          validity: Validity.Valid,
        },
        {
          text: pendingMessage,
          validity: Validity.Pending,
        },
      ],
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    complement.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: 'orange',
        validity: Validity.Valid,
        messages: [
          {
            text: colorValidMessage,
            validity: Validity.Valid,
          },
          {
            text: isInStockMessage,
            validity: Validity.Valid,
          },
        ],
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: true,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    complementInStockValidator.resolve();
  });

  test(`When the state of its controller changes, its controlFn is called. If
  that function returns void, its value remains unchanged.`, () => {
    // initial value is green
    expect(complement.state.value).toBe('green');

    // change this value
    complement.setValue('blue');

    // the value of complement will not change because the controlFn returns void
    // when the value property of the controller's state is unchanged.
    color.focus();

    expect(complement.state.value).toBe('blue');

    // here, color is set to an invalid value. Once again, the value of
    // complement is unchanged.
    color.setValue('');

    expect(complement.state.value).toBe('blue');
  });

  test(`When the state of its controller changes, its controlFn is called. If
  that function returns a state object, its value is updated.`, () => {
    // initial value is green
    expect(complement.state.value).toBe('green');

    // now, update the value of the controller
    color.setValue('green');
    expect(complement.state.value).toBe('red');
  });

  test(`When focus() is called, isInFocus becomes true and didPropertyChange()
  returns true for 'isInFocus.' didPropertyChange() returns false for all other
  properties.`, () => {
    complement.focus();

    expect(complement.state.isInFocus).toBe(true);
    expect(complement.state.didPropertyChange('isInFocus')).toBe(true);

    for (const key of Object.keys(complement.state).filter(
      k => k !== 'isInFocus' && k !== 'didPropertyChange',
    )) {
      expect(
        complement.state.didPropertyChange(key as keyof FieldState<string>),
      ).toBe(false);
    }
  });

  test(`When cancelFocus() is called, isInFocus becomes false and
  didPropertyChange() returns true for 'isInFocus' and false for all other
  properties.`, () => {
    complement.focus();
    expect(complement.state.isInFocus).toBe(true);

    complement.cancelFocus();

    expect(complement.state.isInFocus).toBe(false);
    expect(complement.state.didPropertyChange('isInFocus')).toBe(true);

    for (const key of Object.keys(complement.state).filter(
      k => k !== 'isInFocus' && k !== 'didPropertyChange',
    )) {
      expect(
        complement.state.didPropertyChange(key as keyof FieldState<string>),
      ).toBe(false);
    }
  });

  test(`When blur() is called, isInFocus becomes false. The first time,
  hasBeenBlurred becomes true and didPropertyChange() returns true for both
  isInFocus and hasBeenBlurred. On subsequent calls, didPropertyChange() returns
  true for isInFocus but false for hasBeenBlurred.`, () => {
    complement.focus();
    expect(complement.state.isInFocus).toBe(true);

    complement.blur();

    expect(complement.state.isInFocus).toBe(false);
    expect(complement.state.hasBeenBlurred).toBe(true);
    expect(complement.state.didPropertyChange('isInFocus')).toBe(true);
    expect(complement.state.didPropertyChange('hasBeenBlurred')).toBe(true);

    for (const key of Object.keys(complement.state).filter(
      k =>
        k !== 'isInFocus' &&
        k !== 'hasBeenBlurred' &&
        k !== 'didPropertyChange',
    )) {
      expect(
        complement.state.didPropertyChange(key as keyof FieldState<string>),
      ).toBe(false);
    }

    complement.focus();
    complement.blur();

    expect(complement.state.didPropertyChange('isInFocus')).toBe(true);
    expect(complement.state.didPropertyChange('hasBeenBlurred')).toBe(false);
  });

  test(`When setSubmitted() is called, submitted becomes true and
  didPropertyChange() returns true for 'submitted' and false for all other
  properties. On subsequent calls, didPropertyChange() returns false for
  submitted.`, () => {
    expect(complement.state.submitted).toBe(false);

    complement.setSubmitted();

    expect(complement.state.submitted).toBe(true);
    expect(complement.state.didPropertyChange('submitted')).toBe(true);

    for (const key of Object.keys(complement.state).filter(
      k => k !== 'submitted' && k !== 'didPropertyChange',
    )) {
      expect(
        complement.state.didPropertyChange(key as keyof FieldState<string>),
      ).toBe(false);
    }

    complement.setSubmitted();
    expect(complement.state.didPropertyChange('submitted')).toBe(false);
  });

  test(`When reset() is called, its initFn() is called and its state is set
  with the result, plus default values for properties such as
  hasBeenBlurred.`, () => {
    complement.setValue('purple');
    complement.focus();
    complement.blur();
    complement.setSubmitted();

    expect(complement.state).toStrictEqual({
      value: 'purple',
      validity: Validity.Pending,
      messages: [
        {
          text: colorValidMessage,
          validity: Validity.Valid,
        },
        {
          text: pendingMessage,
          validity: Validity.Pending,
        },
      ],
      isInFocus: false,
      hasBeenBlurred: true,
      hasBeenModified: true,
      submitted: true,
      didPropertyChange: expect.any(Function),
    });

    complement.reset();

    expect(complement.state).toStrictEqual({
      value: 'green',
      validity: Validity.Pending,
      messages: [
        {
          text: colorValidMessage,
          validity: Validity.Valid,
        },
        {
          text: pendingMessage,
          validity: Validity.Pending,
        },
      ],
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    complement.subscribeToState(state => {
      expect(state).toStrictEqual({
        value: 'green',
        validity: Validity.Valid,
        messages: [
          {
            text: colorValidMessage,
            validity: Validity.Valid,
          },
          {
            text: isInStockMessage,
            validity: Validity.Valid,
          },
        ],
        isInFocus: false,
        hasBeenBlurred: false,
        hasBeenModified: false,
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    complementInStockValidator.resolve();
  });

  test(`When reset() is called, if the field is in focus, it remains in
  focus.`, () => {
    complement.focus();
    complement.reset();

    expect(complement.state.isInFocus).toBe(true);
  });

  test(`Calling setValidityAndMessages updates the field's validity and 
  messages.`, () => {
    const expectedMessages = [
      {
        text: 'Order now! Stock is limited.',
        validity: Validity.Caution,
      },
    ];

    complement.setValidityAndMessages(Validity.Caution, expectedMessages);

    expect(complement.state.validity).toBe(Validity.Caution);
    expect(complement.state.messages).toStrictEqual(expectedMessages);
  });
});
