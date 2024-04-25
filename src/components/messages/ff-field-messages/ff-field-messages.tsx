import React from 'react';
import { getMessagesContainerId, joinClassNames } from '../../utils';
import type { FFFieldMessagesProps } from './ff-field-messages-props.type';
import type { AnyForm, AnyField, FormChild } from '../../../model';
import {
  useCombinedMessages,
  useFieldState,
  useConfirmationAttempted,
  useGroupValidation,
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
  const groupValidity = useGroupValidation(...groups);

  return (
    <div
      id={getMessagesContainerId(field.id)}
      className={joinClassNames(
        containerClassName,
        getContainerClassName &&
          getContainerClassName({
            fieldState,
            confirmationAttempted,
            groupValidity,
          }),
      )}
      style={{
        ...containerStyle,
        ...(getContainerStyle &&
          getContainerStyle({
            fieldState,
            confirmationAttempted,
            groupValidity,
          })),
      }}
    >
      {messages.map(({ text, validity }, index) => {
        return (
          <FFMessage
            text={text}
            key={index}
            className={joinClassNames(
              messageClassName,
              getMessageClassName &&
                getMessageClassName({
                  validity,
                  fieldState,
                  confirmationAttempted,
                }),
            )}
            style={{
              ...messageStyle,
              ...(getMessageStyle &&
                getMessageStyle({
                  validity,
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
