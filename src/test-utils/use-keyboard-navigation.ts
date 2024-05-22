import { useEffect } from 'react';

export function useKeyboardNavigation(): void {
  useEffect(() => {
    const onKeyUp: (this: Document, ev: KeyboardEvent) => unknown = e => {
      if (e.altKey) {
        if (e.key === 'ArrowLeft') {
          window.history.back();
        } else if (e.key === 'ArrowRight') {
          window.history.forward();
        }
      }
    };

    document.addEventListener('keyup', onKeyUp);

    return (): void => document.removeEventListener('keyup', onKeyUp);
  });
}
