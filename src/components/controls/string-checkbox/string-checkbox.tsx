import React from 'react';
import type { StringCheckboxProps } from './string-checkbox-props.type';
import type { AnyForm, AnyStringTypeField, ChildOfForm } from '../../../model';
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

export function StringCheckbox<
  Form extends AnyForm,
  Field extends AnyStringTypeField & ChildOfForm<Form>,
>({
  form,
  field,
  groups = [],
  value,
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
}: StringCheckboxProps<Form, Field>): React.JSX.Element {
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
        checked={fieldState.value === value}
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
          field.setValue(!(e.target as HTMLInputElement).checked ? value : '');
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
