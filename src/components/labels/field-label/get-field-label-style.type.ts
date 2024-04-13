import type { AnyField, Validity } from '../../../model';
import type { CSSProperties } from 'react';

export type GetFieldLabelStyleArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetFieldLabelStyle<Field extends AnyField> = (
  args: GetFieldLabelStyleArgs<Field>,
) => CSSProperties | undefined;
