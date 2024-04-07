import React, { type ReactNode } from 'react';
import { useConfirmationAttempted, useStatefulEntityState } from '../../hooks';
import { useGroupValidation } from '../../hooks/use-group-validation';
import { joinClassNames } from '../utils';
import type {
  AbstractField,
  AbstractForm,
  FormConstituents,
  PickSingleTypeFormElements,
} from '../../model';
import type { InputProps, StringInputTypes } from '../types';

export function Input<
  ParentForm extends AbstractForm<string, FormConstituents>,
  FieldName extends keyof PickSingleTypeFormElements<
    ParentForm,
    AbstractField<string, string, boolean>
  >,
  Type extends StringInputTypes,
>({
  form,
  fieldName,
  type,
  groupNames = [],
  className,
  getClassName,
  style,
  getStyle,
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
}: InputProps<ParentForm, FieldName, Type>): ReactNode {
  const field = form.formElements[
    fieldName as keyof typeof form.formElements
  ] as AbstractField<string, string, boolean>;
  const fieldState = useStatefulEntityState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(
    groupNames.map(
      groupName => form.groups[groupName as keyof typeof form.groups],
    ),
  );

  return (
    <input
      id={field.id}
      name={field.name}
      type={type}
      value={fieldState.value}
      onChange={({ target }) => field.setValue(target.value)}
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
