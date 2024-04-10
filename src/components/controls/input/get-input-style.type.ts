import type { AnyStringTypeField, Validity } from '../../../model';
import type { CSSProperties } from 'react';

export type GetInputStyleArgs<Field extends AnyStringTypeField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetInputStyle<Field extends AnyStringTypeField> = (
  args: GetInputStyleArgs<Field>,
) => CSSProperties | undefined;
