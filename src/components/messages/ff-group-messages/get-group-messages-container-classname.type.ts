export type GetGroupMessagesContainerClassNameArgs = {
  confirmationAttempted: boolean;
};

export type GetGroupMessagesContainerClassName = (
  args: GetGroupMessagesContainerClassNameArgs,
) => string | undefined;
