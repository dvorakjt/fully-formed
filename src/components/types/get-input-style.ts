import type { FormElement, Validity } from '../../model';
import type { CSSProperties } from 'react';

type GetInputStyleArgs<Field extends FormElement> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetInputStyle<Field extends FormElement> = (
  args: GetInputStyleArgs<Field>,
) => CSSProperties | undefined;
