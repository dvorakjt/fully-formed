import React from 'react';
import {
  useFieldState,
  useConfirmationAttempted,
  useGroupValidation,
} from '../../../hooks';
import { getAriaInvalid, getDisabled, joinClassNames } from '../../utils';
import type { AnyForm, TypedField, FormChild } from '../../../model';
import type { FFSelectProps } from './ff-select-props.type';

export function FFSelect<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string>>,
>({
  form,
  field,
  groups = [],
  children,
  className,
  getClassName,
  style,
  getStyle,
  autoComplete,
  autoFocus,
  disabled,
  disabledWhenExcluded,
  size,
  ['aria-required']: ariaRequired,
  ['aria-describedby']: ariaDescribedBy,
}: FFSelectProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <select
      name={field.name}
      id={field.id}
      value={fieldState.value}
      onChange={e => field.setValue(e.target.value)}
      onFocus={() => field.focus()}
      onBlur={() => field.visit()}
      className={joinClassNames(
        className,
        getClassName &&
          getClassName({
            fieldState,
            confirmationAttempted,
            groupValidity,
          }),
      )}
      style={{
        ...style,
        ...(getStyle &&
          getStyle({ fieldState, confirmationAttempted, groupValidity })),
      }}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      disabled={getDisabled({ fieldState, disabled, disabledWhenExcluded })}
      size={size}
      aria-invalid={getAriaInvalid(
        fieldState,
        confirmationAttempted,
        groupValidity,
      )}
      aria-required={ariaRequired}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </select>
  );
}
