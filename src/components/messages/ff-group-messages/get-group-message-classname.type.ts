import type { Validity } from '../../../model';

export type GetGroupMessageClassNameArgs = {
  messageValidity: Validity;
  confirmationAttempted: boolean;
};

export type GetGroupMessageClassName = (
  args: GetGroupMessageClassNameArgs,
) => string | undefined;
