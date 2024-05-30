import { useCancelFocusOnUnmount } from '.';
import type { FocusEventHandler } from 'react';
import type { Focusable } from '../model';

type FocusProps = {
  onFocus: FocusEventHandler;
  onBlur: FocusEventHandler;
};

export function useFocusEvents(entity: Focusable): FocusProps {
  useCancelFocusOnUnmount(entity);

  const props: FocusProps = {
    onFocus: () => entity.focus(),
    onBlur: () => entity.blur(),
  };

  return props;
}
