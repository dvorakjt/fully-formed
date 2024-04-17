import type { AnyField, Validity } from '../../model';

export type GetControlClassNameArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetControlClassName<Field extends AnyField> = (
  args: GetControlClassNameArgs<Field>,
) => string | undefined;
