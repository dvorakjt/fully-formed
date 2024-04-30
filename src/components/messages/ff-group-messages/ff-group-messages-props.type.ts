import type { CSSProperties } from 'react';
import type { AnyForm } from '../../../model';
import type { GroupMessagesProps } from './group-messages-props.type';
import type { GetGroupMessagesContainerClassName } from './get-group-messages-container-classname.type';
import type { GetGroupMessagesContainerStyle } from './get-group-messages-container-style.type';
import type { GetGroupMessageClassName } from './get-group-message-classname.type';
import type { GetGroupMessageStyle } from './get-group-message-style.type';

export type FFGroupMessagesProps<Form extends AnyForm> =
  GroupMessagesProps<Form> & {
    containerClassName?: string;
    getContainerClassName?: GetGroupMessagesContainerClassName;
    containerStyle?: CSSProperties;
    getContainerStyle?: GetGroupMessagesContainerStyle;
    messageClassName?: string;
    getMessageClassName?: GetGroupMessageClassName;
    messageStyle?: CSSProperties;
    getMessageStyle?: GetGroupMessageStyle;
  };
