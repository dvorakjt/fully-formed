import { useEffect } from 'react';

export function useKeyboardNavigation(): void {
  useEffect(() => {
    const onKeyUp: (this: Document, ev: KeyboardEvent) => unknown = e => {
      /* istanbul ignore else -- @preserve */
      if (e.altKey) {
        if (e.key === 'ArrowLeft') {
          window.history.back();
        } else {
          /* istanbul ignore else -- @preserve */
          if (e.key === 'ArrowRight') {
            window.history.forward();
          }
        }
      }
    };

    document.addEventListener('keyup', onKeyUp);

    return (): void => document.removeEventListener('keyup', onKeyUp);
  });
}
