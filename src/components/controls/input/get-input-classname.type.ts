import type { AbstractField, Validity } from '../../../model';

export type GetInputClassNameArgs<
  Field extends AbstractField<string, unknown, boolean>,
> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetInputClassName<
  Field extends AbstractField<string, unknown, boolean>,
> = (args: GetInputClassNameArgs<Field>) => string | undefined;
