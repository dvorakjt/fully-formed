import React from 'react';
import type { BooleanCheckboxProps } from './boolean-checkbox-props.type';
import {
  Validity,
  type AnyForm,
  type AnyBooleanTypeField,
  type ChildOfForm,
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
} from '../../utils';

export function BooleanCheckbox<
  Form extends AnyForm,
  Field extends AnyBooleanTypeField & ChildOfForm<Form>,
>({
  form,
  field,
  groups = [],
  labelContent,
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
    <>
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
        aria-describedby={getFieldMessagesContainerId(field.id)}
        aria-required={ariaRequired}
        aria-invalid={
          (fieldState.visited ||
            fieldState.modified ||
            confirmationAttempted) &&
          (fieldState.validity === Validity.Invalid ||
            groupValidity === Validity.Invalid)
        }
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
    </>
  );
}
