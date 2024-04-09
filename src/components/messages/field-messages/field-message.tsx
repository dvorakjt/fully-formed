import React from 'react';
import type { FieldMessageProps } from './field-message-props.type';

export function FieldMessage({
  text,
  className,
  style,
  key,
}: FieldMessageProps): React.JSX.Element {
  return (
    <span className={className} style={style} key={key}>
      {text}
    </span>
  );
}
