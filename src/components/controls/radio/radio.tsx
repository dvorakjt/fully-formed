import React from 'react';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import { joinClassNames } from '../../utils';
import type { AnyForm, AnyStringTypeField, ChildOfForm } from '../../../model';
import type { RadioProps } from './radio-props.type';

export function Radio<
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
  radioClassName,
  getRadioClassName,
  radioStyle,
  getRadioStyle,
  labelClassName,
  getLabelClassName,
  labelStyle,
  getLabelStyle,
}: RadioProps<Form, Field>): React.JSX.Element {
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
        type="radio"
        name={field.name}
        id={`${field.id}-${value}`}
        value={value}
        checked={fieldState.value === value}
        onFocus={() => field.focus()}
        onBlur={() => field.visit()}
        onChange={() => field.setValue(value)}
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
        htmlFor={`${field.id}-${value}`}
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
