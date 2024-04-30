import type { CSSProperties } from 'react';
import type { Validity } from '../../../model';

export type GetGroupMessageStyleArgs = {
  messageValidity: Validity;
  confirmationAttempted: boolean;
};

export type GetGroupMessageStyle = (
  args: GetGroupMessageStyleArgs,
) => CSSProperties | undefined;
