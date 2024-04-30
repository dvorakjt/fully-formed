import React from 'react';
import { useConfirmationAttempted, useCombinedMessages } from '../../../hooks';
import { joinClassNames } from '../../utils';
import { FFMessage } from '../ff-message';
import type { AnyForm } from '../../../model';
import type { FFGroupMessagesProps } from './ff-group-messages-props.type';

export function FFGroupMessages<Form extends AnyForm>({
  form,
  groups,
  containerId,
  containerClassName,
  getContainerClassName,
  containerStyle,
  getContainerStyle,
  messageClassName,
  getMessageClassName,
  messageStyle,
  getMessageStyle,
}: FFGroupMessagesProps<Form>): React.JSX.Element {
  const confirmationAttempted = useConfirmationAttempted(form);
  const messages = useCombinedMessages(...groups);

  return (
    <div
      id={containerId}
      className={joinClassNames(
        containerClassName,
        getContainerClassName &&
          getContainerClassName({
            confirmationAttempted,
          }),
      )}
      style={{
        ...containerStyle,
        ...(getContainerStyle &&
          getContainerStyle({
            confirmationAttempted,
          })),
      }}
    >
      {messages.map(({ text, validity: messageValidity }, index) => {
        return (
          <FFMessage
            text={text}
            key={index}
            className={joinClassNames(
              messageClassName,
              getMessageClassName &&
                getMessageClassName({
                  messageValidity,
                  confirmationAttempted,
                }),
            )}
            style={{
              ...messageStyle,
              ...(getMessageStyle &&
                getMessageStyle({
                  messageValidity,
                  confirmationAttempted,
                })),
            }}
          />
        );
      })}
    </div>
  );
}
