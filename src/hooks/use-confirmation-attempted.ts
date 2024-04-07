import { useState, useLayoutEffect } from 'react';
import type { AbstractForm, FormConstituents } from '../model';

export function useConfirmationAttempted<
  T extends AbstractForm<string, FormConstituents>,
>(form: T): boolean {
  const [confirmationAttempted, setConfirmationAttempted] = useState<boolean>(
    form.confirmationAttempted,
  );

  useLayoutEffect(() => {
    const subscription = form.subscribeToConfirmationAttempted(
      updatedConfirmationAttempted => {
        setConfirmationAttempted(updatedConfirmationAttempted);
      },
    );
    return () => subscription.unsubscribe();
  });

  return confirmationAttempted;
}
