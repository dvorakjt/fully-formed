import type { AnyField, Validity } from '../../../model';

export type GetFieldLabelClassNameArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetFieldLabelClassName<Field extends AnyField> = (
  args: GetFieldLabelClassNameArgs<Field>,
) => string | undefined;
