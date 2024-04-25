import React from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { FFRadioGroupProps } from './ff-radio-group-props.type';
import {
  getAriaInvalid,
  getMessagesContainerId,
  getLegendId,
  joinClassNames,
} from '../../utils';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';

export function FFRadioGroup<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
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
}: FFRadioGroupProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={getLegendId(field.id)}
      aria-describedby={getMessagesContainerId(field.id)}
      aria-required={ariaRequired}
      aria-invalid={getAriaInvalid(
        fieldState,
        confirmationAttempted,
        groupValidity,
      )}
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
    >
      {children}
    </fieldset>
  );
}
