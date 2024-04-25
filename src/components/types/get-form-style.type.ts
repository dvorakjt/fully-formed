import type { CSSProperties } from 'react';
import type { Validity } from '../../model';

export type GetFormStyleArgs = {
  validity: Validity;
  confirmationAttempted: boolean;
};

export type GetFormStyle = (
  args: GetFormStyleArgs,
) => CSSProperties | undefined;
