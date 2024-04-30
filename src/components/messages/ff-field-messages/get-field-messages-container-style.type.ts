import type { CSSProperties } from 'react';
import type { AnyField } from '../../../model';

export type GetFieldMessagesContainerStyleArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
};

export type GetFieldMessagesContainerStyle<Field extends AnyField> = (
  args: GetFieldMessagesContainerStyleArgs<Field>,
) => CSSProperties | undefined;
