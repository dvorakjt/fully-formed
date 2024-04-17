import React from 'react';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import {
  getDisabled,
  getFieldMessagesContainerId,
  joinClassNames,
} from '../../utils';
import type { InputProps } from './input-props.type';
import {
  Validity,
  type AnyForm,
  type AnyStringTypeField,
  type ChildOfForm,
} from '../../../model';

export function Input<
  Form extends AnyForm,
  Field extends AnyStringTypeField & ChildOfForm<Form>,
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
      onChange={e => field.setValue(e.target.value)}
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
      aria-invalid={
        (fieldState.visited || fieldState.modified || confirmationAttempted) &&
        (fieldState.validity === Validity.Invalid ||
          groupValidity === Validity.Invalid)
      }
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
