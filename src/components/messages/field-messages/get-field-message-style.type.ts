import type { CSSProperties } from 'react';
import type { AnyField, Validity } from '../../../model';

export type GetFieldMessageStyleArgs<Field extends AnyField> = {
  validity: Validity;
  fieldState: Field['state'];
  confirmationAttempted: boolean;
};

export type GetFieldMessageStyle<Field extends AnyField> = (
  args: GetFieldMessageStyleArgs<Field>,
) => CSSProperties | undefined;
