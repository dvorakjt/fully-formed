import React from 'react';
import {
  useFieldState,
  useConfirmationAttempted,
  useGroupValidation,
} from '../../../hooks';
import { getDisabled, joinClassNames } from '../../utils';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { FFSelectProps } from './ff-select-props.type';

export function FFSelect<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
>({
  form,
  field,
  options,
  groups = [],
  selectClassName,
  getSelectClassName,
  selectStyle,
  getSelectStyle,
  optionClassName,
  getOptionClassName,
  optionStyle,
  getOptionStyle,
  autoComplete,
  autoFocus,
  disabled,
  disabledWhenExcluded,
  multiple,
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
      onChange={e => field.setValue((e.target as HTMLSelectElement).value)}
      onFocus={() => field.focus()}
      onBlur={() => field.visit()}
      className={joinClassNames(
        selectClassName,
        getSelectClassName &&
          getSelectClassName({
            fieldState,
            confirmationAttempted,
            groupValidity,
          }),
      )}
      style={{
        ...selectStyle,
        ...(getSelectStyle &&
          getSelectStyle({ fieldState, confirmationAttempted, groupValidity })),
      }}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      disabled={getDisabled({ fieldState, disabled, disabledWhenExcluded })}
      multiple={multiple}
      size={size}
      aria-required={ariaRequired}
      aria-describedby={ariaDescribedBy}
    >
      {options.map((option, key) => {
        return (
          <option
            key={key}
            className={joinClassNames(
              optionClassName,
              getOptionClassName &&
                getOptionClassName({
                  fieldState,
                  confirmationAttempted,
                  groupValidity,
                }),
            )}
            style={{
              ...optionStyle,
              ...(getOptionStyle &&
                getOptionStyle({
                  fieldState,
                  confirmationAttempted,
                  groupValidity,
                })),
            }}
            value={option.value}
          >
            {option.text}
          </option>
        );
      })}
    </select>
  );
}
