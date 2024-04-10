import type { AnyStringTypeField, Validity } from '../../../model';

export type GetInputClassNameArgs<Field extends AnyStringTypeField> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetInputClassName<Field extends AnyStringTypeField> = (
  args: GetInputClassNameArgs<Field>,
) => string | undefined;
