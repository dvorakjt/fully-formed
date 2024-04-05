/**
 * An object provided as an argument to the `confirm()` method of a form. 
 * 
 * @typeParam ConfirmedValue - The type of value that will be passed into the
 * `onSuccess()` method.
 * 
 * @remarks
 * If the form is valid and an `onSuccess()` callback function is provided, that
 * function is called with the value of the form. If the form is not valid and 
 * an `onFailure()` callback is provided, that method will instead be called.
 */
export type ConfirmMethodArgs<ConfirmedValue> = {
  onSuccess?: (value: ConfirmedValue) => void;
  onFailure?: () => void;
};
