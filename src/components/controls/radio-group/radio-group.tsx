import React from 'react';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import type { AnyForm, AnyStringTypeField, ChildOfForm } from '../../../model';
import type { RadioGroupProps } from './radio-group-props.type';
import {
  getAriaInvalid,
  getFieldMessagesContainerId,
  joinClassNames,
} from '../../utils';

export function RadioGroup<
  Form extends AnyForm,
  Field extends AnyStringTypeField & ChildOfForm<Form>,
>({
  form,
  field,
  groups = [],
  className,
  getClassName,
  style,
  getStyle,
  children,
  ['aria-required']: ariaRequired,
}: RadioGroupProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <fieldset
      role="radiogroup"
      tabIndex={0}
      onFocus={() => field.focus()}
      onBlur={() => field.visit()}
      aria-required={ariaRequired}
      aria-invalid={getAriaInvalid(
        fieldState,
        confirmationAttempted,
        groupValidity,
      )}
      aria-describedby={getFieldMessagesContainerId(field.id)}
      className={joinClassNames(
        className,
        getClassName &&
          getClassName({ fieldState, confirmationAttempted, groupValidity }),
      )}
      style={{
        ...style,
        ...(getStyle &&
          getStyle({
            fieldState,
            confirmationAttempted,
            groupValidity,
          })),
      }}
    >
      {children}
    </fieldset>
  );
}
