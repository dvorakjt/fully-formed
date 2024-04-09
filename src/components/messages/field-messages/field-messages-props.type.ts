import type { CSSProperties } from 'react';
import type {
  AbstractForm,
  FormConstituents,
  AbstractField,
} from '../../../model';
import type { GetFieldMessagesContainerClassName } from './get-field-messages-container-classname.type';
import type { GetFieldMessagesContainerStyle } from './get-field-messages-container-style.type';
import type { GetFieldMessageClassName } from './get-field-message-classname.type';
import type { GetFieldMessageStyle } from './get-field-message-style.type';

export type FieldMessagesProps<
  Form extends AbstractForm<string, FormConstituents>,
  Field extends AbstractField<string, unknown, boolean> &
    Form['formElements'][keyof Form['formElements']],
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  containerClassName?: string;
  getContainerClassName?: GetFieldMessagesContainerClassName<Field>;
  containerStyle?: CSSProperties;
  getContainerStyle?: GetFieldMessagesContainerStyle<Field>;
  messageClassName?: string;
  getMessageClassName?: GetFieldMessageClassName<Field>;
  messageStyle?: CSSProperties;
  getMessageStyle?: GetFieldMessageStyle<Field>;
};
