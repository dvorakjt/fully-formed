import type { AnyField, Validity } from '../../../model';

export type GetFieldMessageClassNameArgs<Field extends AnyField> = {
  messageValidity: Validity;
  fieldState: Field['state'];
  confirmationAttempted: boolean;
};

export type GetFieldMessageClassName<Field extends AnyField> = (
  args: GetFieldMessageClassNameArgs<Field>,
) => string | undefined;
