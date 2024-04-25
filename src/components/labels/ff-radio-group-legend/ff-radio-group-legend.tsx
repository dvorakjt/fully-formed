import React from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { FFRadioGroupLegendProps } from './ff-radio-group-legend-props.type';
import {
  useConfirmationAttempted,
  useFieldState,
  useGroupValidation,
} from '../../../hooks';
import { getLegendId, joinClassNames } from '../../utils';

export function FFRadioGroupLegend<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
>({
  field,
  form,
  groups = [],
  className,
  getClassName,
  style,
  getStyle,
  children,
}: FFRadioGroupLegendProps<Form, Field>): React.JSX.Element {
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
