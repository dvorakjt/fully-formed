import type { CSSProperties } from 'react';
import type { Validity, AbstractField } from '../../../model';

export type GetFieldMessagesContainerStyleArgs<
  Field extends AbstractField<string, unknown, boolean>,
> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetFieldMessagesContainerStyle<
  Field extends AbstractField<string, unknown, boolean>,
> = (
  args: GetFieldMessagesContainerStyleArgs<Field>,
) => CSSProperties | undefined;
