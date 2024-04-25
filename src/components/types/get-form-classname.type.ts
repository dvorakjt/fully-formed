import type { Validity } from '../../model';

export type GetFormClassNameArgs = {
  validity: Validity;
  confirmationAttempted: boolean;
};

export type GetFormClassName = (
  args: GetFormClassNameArgs,
) => string | undefined;
