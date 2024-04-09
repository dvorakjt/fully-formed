import React from 'react';
import { getFieldMessagesContainerId, joinClassNames } from '../../utils';
import type { FieldMessagesProps } from './field-messages-props.type';
import type {
  AbstractForm,
  FormConstituents,
  AbstractField,
} from '../../../model';
import {
  useCombinedMessages,
  useFieldState,
  useConfirmationAttempted,
  useGroupValidation,
} from '../../../hooks';
import { FieldMessage } from './field-message';

export function FieldMessages<
  Form extends AbstractForm<string, FormConstituents>,
  Field extends AbstractField<string, unknown, boolean> &
    Form['formElements'][keyof Form['formElements']],
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
}: FieldMessagesProps<Form, Field>): React.JSX.Element {
  const messages = useCombinedMessages(field, ...groups);
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(groups);

  return (
    <div
      id={getFieldMessagesContainerId(field.id)}
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
          <FieldMessage
            text={text}
            key={`${field.id}-messages-${index}`}
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
