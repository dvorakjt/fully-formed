import React from 'react';
import type { BooleanCheckboxProps } from './boolean-checkbox-props.type';
import type {
  AnyForm,
  AnyBooleanTypeField,
  ConstituentOfForm,
} from '../../../model';
import {
  useFieldState,
  useConfirmationAttempted,
  useGroupValidation,
} from '../../../hooks';
import {
  getFieldMessagesContainerId,
  joinClassNames,
  getDisabled,
  getAriaInvalid,
} from '../../utils';
import type { Checkbox } from '../../types';

export function BooleanCheckbox<
  Form extends AnyForm,
  Field extends AnyBooleanTypeField & ConstituentOfForm<Form, 'formElements'>,
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
}: BooleanCheckboxProps<Form, Field>): React.JSX.Element {
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
          field.setValue(!(e.target as unknown as Checkbox).checked);
        }}
        disabled={getDisabled({ fieldState, disabled, disabledWhenExcluded })}
        aria-describedby={getFieldMessagesContainerId(field.id)}
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
