import React from 'react';
import type { FFMessageProps } from './ff-message-props.type';

export function FFMessage({
  text,
  className,
  style,
}: FFMessageProps): React.JSX.Element {
  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}
