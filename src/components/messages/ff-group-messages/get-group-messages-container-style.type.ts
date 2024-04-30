import type { CSSProperties } from 'react';

export type GetGroupMessagesContainerStyleArgs = {
  confirmationAttempted: boolean;
};

export type GetGroupMessagesContainerStyle = (
  args: GetGroupMessagesContainerStyleArgs,
) => CSSProperties | undefined;
