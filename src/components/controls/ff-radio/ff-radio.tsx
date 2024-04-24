import React, { useId } from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { FFRadioProps } from './ff-radio-props.type';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import { getDisabled, joinClassNames } from '../../utils';

export function FFRadio<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
>({
  form,
  field,
  groups = [],
  value,
  labelContent,
  disabled,
  disabledWhenExcluded,
  containerClassName,
  getContainerClassName,
  containerStyle,
  getContainerStyle,
  radioClassName,
  getRadioClassName,
  radioStyle,
  getRadioStyle,
  labelClassName,
  getLabelClassName,
  labelStyle,
  getLabelStyle,
}: FFRadioProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);
  const inputId = useId();

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
        type="radio"
        name={field.name}
        id={inputId}
        value={value}
        checked={fieldState.value === value}
        onChange={e => field.setValue(e.target.value)}
        onFocus={() => field.focus()}
        onBlur={() => field.visit()}
        disabled={getDisabled({ fieldState, disabled, disabledWhenExcluded })}
        className={joinClassNames(
          radioClassName,
          getRadioClassName &&
            getRadioClassName({
              fieldState,
              confirmationAttempted,
              groupValidity,
            }),
        )}
        style={{
          ...radioStyle,
          ...(getRadioStyle &&
            getRadioStyle({
              fieldState,
              confirmationAttempted,
              groupValidity,
            })),
        }}
      />
      <label
        htmlFor={inputId}
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
