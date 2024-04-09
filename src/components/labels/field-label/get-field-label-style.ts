import type { FormElement, Validity } from '../../../model';
import type { CSSProperties } from 'react';

export type GetFieldLabelStyleArgs<Field extends FormElement> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetFieldLabelStyle<Field extends FormElement> = (
  args: GetFieldLabelStyleArgs<Field>,
) => CSSProperties | undefined;
