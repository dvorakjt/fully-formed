import type { CSSProperties } from 'react';
import type { AnyField, Validity } from '../../../model';

export type GetFieldMessagesContainerStyleArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetFieldMessagesContainerStyle<Field extends AnyField> = (
  args: GetFieldMessagesContainerStyleArgs<Field>,
) => CSSProperties | undefined;
