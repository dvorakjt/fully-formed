import React from 'react';
import type { AnyForm, AnyField, FormChild } from '../../../model';
import type { FFLabelProps } from './ff-label-props.type';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import { joinClassNames } from '../../utils';

export function FFLabel<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyField>,
>({
  field,
  form,
  groups = [],
  className,
  getClassName,
  style,
  getStyle,
  children,
}: FFLabelProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <label
      htmlFor={field.id}
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
    </label>
  );
}
