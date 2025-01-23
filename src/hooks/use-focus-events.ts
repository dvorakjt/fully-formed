import { useCancelFocusOnUnmount } from './use-cancel-focus-on-unmount';
import type { FocusEventHandler } from 'react';
import type { Focusable } from '../model';

type FocusProps = {
  onFocus: FocusEventHandler;
  onBlur: FocusEventHandler;
};

/**
 * A React hook that can be passed into the props of an HTML input element (or
 * select, textarea, etc.) via spread syntax. When the element receives focus,
 * the hook will call the `onFocus` method of the {@link Focusable} entity it
 * received. When the field is blurred, the `onBlur` method will be called.
 *
 * The hook also calls {@link useCancelFocusOnUnmount}, ensuring that
 * `cancelFocus()` is called when the element loses focus through means that
 * do not trigger the blur event (for instance, using the keyboard to navigate
 * backwards or forwards).
 *
 * @param entity - The {@link Focusable} entity that should respond to the
 * focus events of the HTML element that receives this hook in its props.
 *
 * @returns An object that can be passed into the props of an HTML input,
 * select, textarea, etc. via spread syntax.
 */
export function useFocusEvents(entity: Focusable): FocusProps {
  useCancelFocusOnUnmount(entity);

  const props: FocusProps = {
    onFocus: () => entity.focus(),
    onBlur: () => entity.blur(),
  };

  return props;
}
