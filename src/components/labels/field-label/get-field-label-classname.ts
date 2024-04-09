import type { AbstractField, Validity } from '../../../model';

export type GetFieldLabelClassNameArgs<
  Field extends AbstractField<string, unknown, boolean>,
> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetFieldLabelClassName<
  Field extends AbstractField<string, unknown, boolean>,
> = (args: GetFieldLabelClassNameArgs<Field>) => string | undefined;
