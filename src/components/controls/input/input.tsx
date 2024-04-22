import React from 'react';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import {
  getAriaInvalid,
  getDisabled,
  getFieldMessagesContainerId,
  joinClassNames,
} from '../../utils';
import type { InputProps } from './input-props.type';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { InputElement } from '../../types';

export function Input<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
>({
  field,
  form,
  type,
  groups = [],
  className,
  getClassName,
  style,
  getStyle,
  disabled,
  disabledWhenExcluded,
  readOnly,
  autoFocus,
  autoCapitalize,
  autoComplete,
  placeholder,
  list,
  max,
  min,
  maxLength,
  size,
  step,
  ['aria-required']: ariaRequired,
}: InputProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <input
      name={field.name}
      id={field.id}
      type={type}
      value={fieldState.value}
      onChange={e =>
        field.setValue((e.target as unknown as InputElement).value)
      }
      onFocus={() => field.focus()}
      onBlur={() => field.visit()}
      className={joinClassNames(
        className,
        getClassName &&
          getClassName({ fieldState, confirmationAttempted, groupValidity }),
      )}
      style={{
        ...style,
        ...(getStyle &&
          getStyle({ fieldState, confirmationAttempted, groupValidity })),
      }}
      disabled={getDisabled({ fieldState, disabled, disabledWhenExcluded })}
      readOnly={readOnly}
      aria-readonly={readOnly}
      aria-required={ariaRequired}
      aria-describedby={getFieldMessagesContainerId(field.id)}
      aria-invalid={getAriaInvalid(
        fieldState,
        confirmationAttempted,
        groupValidity,
      )}
      autoFocus={autoFocus}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      placeholder={placeholder}
      list={list}
      max={max}
      min={min}
      maxLength={maxLength}
      size={size}
      step={step}
    />
  );
}
