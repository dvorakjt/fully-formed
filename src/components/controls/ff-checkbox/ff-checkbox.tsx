import React from 'react';
import type { FFCheckboxProps } from './ff-checkbox-props.type';
import type { AnyForm, AnyBooleanTypeField, FormChild } from '../../../model';
import {
  useFieldState,
  useConfirmationAttempted,
  useGroupValidation,
} from '../../../hooks';
import {
  getAriaDescribedBy,
  joinClassNames,
  getDisabled,
  getAriaInvalid,
} from '../../utils';

export function FFCheckbox<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyBooleanTypeField>,
>({
  form,
  field,
  groups = [],
  labelContent,
  containerClassName,
  getContainerClassName,
  containerStyle,
  getContainerStyle,
  checkboxClassName,
  getCheckboxClassName,
  checkboxStyle,
  getCheckboxStyle,
  labelClassName,
  getLabelClassName,
  labelStyle,
  getLabelStyle,
  disabled,
  disabledWhenExcluded,
  ['aria-required']: ariaRequired,
  ['aria-describedby']: ariaDescribedBy,
}: FFCheckboxProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <div
      className={joinClassNames(
        containerClassName,
        getContainerClassName &&
          getContainerClassName({
            fieldState,
            confirmationAttempted,
            groupValidity,
          }),
      )}
      style={{
        ...containerStyle,
        ...(getContainerStyle &&
          getContainerStyle({
            fieldState,
            confirmationAttempted,
            groupValidity,
          })),
      }}
    >
      <input
        type="checkbox"
        name={field.name}
        id={field.id}
        checked={fieldState.value}
        className={joinClassNames(
          checkboxClassName,
          getCheckboxClassName &&
            getCheckboxClassName({
              fieldState,
              confirmationAttempted,
              groupValidity,
            }),
        )}
        style={{
          ...checkboxStyle,
          ...(getCheckboxStyle &&
            getCheckboxStyle({
              fieldState,
              confirmationAttempted,
              groupValidity,
            })),
        }}
        onFocus={() => field.focus()}
        onBlur={() => field.visit()}
        onInput={e => {
          field.setValue(!(e.target as HTMLInputElement).checked);
        }}
        disabled={getDisabled({ fieldState, disabled, disabledWhenExcluded })}
        aria-describedby={getAriaDescribedBy(field.id, ariaDescribedBy)}
        aria-required={ariaRequired}
        aria-invalid={getAriaInvalid(
          fieldState,
          confirmationAttempted,
          groupValidity,
        )}
      />
      <label
        htmlFor={field.id}
        className={joinClassNames(
          labelClassName,
          getLabelClassName &&
            getLabelClassName({
              fieldState,
              confirmationAttempted,
              groupValidity,
            }),
        )}
        style={{
          ...labelStyle,
          ...(getLabelStyle &&
            getLabelStyle({
              fieldState,
              confirmationAttempted,
              groupValidity,
            })),
        }}
      >
        {labelContent}
      </label>
    </div>
  );
}
