import React from 'react';
import type { AnyForm, AnyField, ConstituentOfForm } from '../../../model';
import type { FieldLabelProps } from './field-label-props.type';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import { joinClassNames } from '../../utils';

export function FieldLabel<
  Form extends AnyForm,
  Field extends AnyField & ConstituentOfForm<Form, 'formElements'>,
>({
  field,
  form,
  groups = [],
  className,
  getClassName,
  style,
  getStyle,
  children,
}: FieldLabelProps<Form, Field>): React.JSX.Element {
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
