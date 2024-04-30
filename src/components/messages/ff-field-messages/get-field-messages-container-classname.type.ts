import type { AnyField } from '../../../model';

export type GetFieldMessagesContainerClassNameArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
};

export type GetFieldMessagesContainerClassName<Field extends AnyField> = (
  args: GetFieldMessagesContainerClassNameArgs<Field>,
) => string | undefined;
