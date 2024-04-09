import type { Validity, AbstractField } from '../../../model';

export type GetFieldMessagesContainerClassNameArgs<
  Field extends AbstractField<string, unknown, boolean>,
> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetFieldMessagesContainerClassName<
  Field extends AbstractField<string, unknown, boolean>,
> = (args: GetFieldMessagesContainerClassNameArgs<Field>) => string | undefined;
