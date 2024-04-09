import type { CSSProperties } from 'react';
import type { Validity, AbstractField } from '../../../model';

export type GetFieldMessageStyleArgs<
  Field extends AbstractField<string, unknown, boolean>,
> = {
  validity: Validity;
  fieldState: Field['state'];
  confirmationAttempted: boolean;
};

export type GetFieldMessageStyle<
  Field extends AbstractField<string, unknown, boolean>,
> = (args: GetFieldMessageStyleArgs<Field>) => CSSProperties | undefined;
