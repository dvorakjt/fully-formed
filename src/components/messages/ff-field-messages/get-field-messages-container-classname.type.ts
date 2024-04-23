import type { AnyField, Validity } from '../../../model';

export type GetFieldMessagesContainerClassNameArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetFieldMessagesContainerClassName<Field extends AnyField> = (
  args: GetFieldMessagesContainerClassNameArgs<Field>,
) => string | undefined;
