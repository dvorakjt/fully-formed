import React from 'react';
import type { AnyForm, AnyField, FormChild } from '../../../model';
import type { FFLegendProps } from './ff-legend-props.type';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import { getLegendId, joinClassNames } from '../../utils';

export function FFLegend<
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
}: FFLegendProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <legend
      id={getLegendId(field.id)}
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
    </legend>
  );
}
