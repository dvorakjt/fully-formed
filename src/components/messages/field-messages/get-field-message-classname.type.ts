import type { Validity, AbstractField } from '../../../model';

export type GetFieldMessageClassNameArgs<
  Field extends AbstractField<string, unknown, boolean>,
> = {
  validity: Validity;
  fieldState: Field['state'];
  confirmationAttempted: boolean;
};

export type GetFieldMessageClassName<
  Field extends AbstractField<string, unknown, boolean>,
> = (args: GetFieldMessageClassNameArgs<Field>) => string | undefined;
