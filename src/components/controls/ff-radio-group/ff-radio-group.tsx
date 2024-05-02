import React from 'react';
import type { AnyForm, TypedField, FormChild } from '../../../model';
import type { FFRadioGroupProps } from './ff-radio-group-props.type';
import {
  getAriaDescribedBy,
  getAriaInvalid,
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
  Field extends FormChild<Form, TypedField<string>>,
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
  ['aria-describedby']: ariaDescribedBy,
}: FFRadioGroupProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={getLegendId(field.id)}
      aria-describedby={getAriaDescribedBy(field.id, ariaDescribedBy)}
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
