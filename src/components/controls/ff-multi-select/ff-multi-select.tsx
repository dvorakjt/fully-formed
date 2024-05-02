import React from 'react';
import {
  useFieldState,
  useConfirmationAttempted,
  useGroupValidation,
} from '../../../hooks';
import { getAriaInvalid, getDisabled, joinClassNames } from '../../utils';
import type { AnyForm, TypedField, FormChild } from '../../../model';
import type { FFMultiSelectProps } from './ff-multi-select-props.type';

export function FFMultiSelect<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string[]>>,
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
}: FFMultiSelectProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <select
      name={field.name}
      id={field.id}
      value={fieldState.value}
      onChange={e => {
        field.setValue(
          Array.from(e.target.selectedOptions, option => option.value),
        );
      }}
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
      multiple
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
