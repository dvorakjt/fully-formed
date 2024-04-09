import React from 'react';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import { getFieldMessagesContainerId, joinClassNames } from '../../utils';
import type { InputProps } from './input-props.type';
import type {
  AbstractField,
  AbstractForm,
  FormConstituents,
} from '../../../model';

export function Input<
  Form extends AbstractForm<string, FormConstituents>,
  Field extends AbstractField<string, string, boolean> &
    Form['formElements'][keyof Form['formElements']],
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
}: InputProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(groups);

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
      disabled={
        !!(
          disabled ||
          (disabledWhenExcluded &&
            'exclude' in fieldState &&
            fieldState.exclude)
        )
      }
      readOnly={readOnly}
      aria-readonly={readOnly}
      aria-describedby={getFieldMessagesContainerId(field.id)}
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
