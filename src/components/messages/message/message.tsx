import React from 'react';
import type { MessageProps } from './message-props.type';

export function MessageComponent({
  text,
  className,
  style,
}: MessageProps): React.JSX.Element {
  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}
