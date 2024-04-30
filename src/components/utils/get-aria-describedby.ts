import { getMessagesContainerId } from './get-messages-container-id';

export function getAriaDescribedBy(
  fieldId: string,
  ariaDescribedBy?: string,
): string {
  const messagesContainerId = getMessagesContainerId(fieldId);

  if (!ariaDescribedBy) return messagesContainerId;

  return `${messagesContainerId} ${ariaDescribedBy}`;
}
