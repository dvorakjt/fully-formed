import type { CSSProperties } from 'react';
import type { AnyField, Validity } from '../../model';

export type GetControlStyleArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetControlStyle<Field extends AnyField> = (
  args: GetControlStyleArgs<Field>,
) => CSSProperties | undefined;
