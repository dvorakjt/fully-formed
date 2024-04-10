import React from 'react';
import {
  FieldMessages,
  type FieldMessagesProps,
} from '../../../components/messages/field-messages';
import {
  Validity,
  type AnyForm,
  type AnyField,
  type ChildOfForm,
} from '../../../model';
import './styles.css';

type StyledMessagesProps<
  Form extends AnyForm,
  Field extends AnyField & ChildOfForm<Form>,
> = FieldMessagesProps<Form, Field> & {
  containerClassName?: never;
  getContainerClassName?: never;
  containerStyle?: never;
  getContainerStyle?: never;
  messageClassName?: never;
  getMessageClassName?: never;
  messageStyle?: never;
  getMessageStyle?: never;
};

export function StyledMessages<
  Form extends AnyForm,
  Field extends AnyField & ChildOfForm<Form>,
>(props: StyledMessagesProps<Form, Field>): React.JSX.Element {
  return (
    <FieldMessages
      {...props}
      containerStyle={{
        display: 'block',
        marginBottom: '18px',
      }}
      messageClassName="message"
      getMessageClassName={({
        fieldState,
        confirmationAttempted,
        validity,
      }) => {
        if (
          !(fieldState.visited || fieldState.modified || confirmationAttempted)
        ) {
          return 'messageHidden';
        }
        if (validity === Validity.Invalid) return 'messageInvalid';
        return 'messageValid';
      }}
    />
  );
}
