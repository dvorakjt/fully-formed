import React from 'react';
import { getMessagesContainerId, joinClassNames } from '../../utils';
import type { FFFieldMessagesProps } from './ff-field-messages-props.type';
import type { AnyForm, AnyField, FormChild } from '../../../model';
import {
  useCombinedMessages,
  useFieldState,
  useConfirmationAttempted,
} from '../../../hooks';
import { FFMessage } from '../ff-message';

export function FFFieldMessages<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyField>,
>({
  form,
  field,
  groups = [],
  containerClassName,
  getContainerClassName,
  containerStyle,
  getContainerStyle,
  messageClassName,
  getMessageClassName,
  messageStyle,
  getMessageStyle,
}: FFFieldMessagesProps<Form, Field>): React.JSX.Element {
  const messages = useCombinedMessages(field, ...groups);
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);

  return (
    <div
      id={getMessagesContainerId(field.id)}
      className={joinClassNames(
        containerClassName,
        getContainerClassName &&
          getContainerClassName({
            fieldState,
            confirmationAttempted,
          }),
      )}
      style={{
        ...containerStyle,
        ...(getContainerStyle &&
          getContainerStyle({
            fieldState,
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
                  fieldState,
                  confirmationAttempted,
                }),
            )}
            style={{
              ...messageStyle,
              ...(getMessageStyle &&
                getMessageStyle({
                  messageValidity,
                  fieldState,
                  confirmationAttempted,
                })),
            }}
          />
        );
      })}
    </div>
  );
}
