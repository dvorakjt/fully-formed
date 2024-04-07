import type { FormElement, Validity } from '../../model';

type GetInputClassNameArgs<Field extends FormElement> = {
  fieldState: Field['state'];
  confirmationAttempted: boolean;
  groupValidity: Validity;
};

export type GetInputClassName<Field extends FormElement> = (
  args: GetInputClassNameArgs<Field>,
) => string | undefined;
