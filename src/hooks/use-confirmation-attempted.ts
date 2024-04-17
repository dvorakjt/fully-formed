import { useState, useEffect } from 'react';
import type { AbstractForm, FormConstituents } from '../model';

/**
 * Takes in an {@link AbstractForm} and returns a React state variable of type
 * `boolean` indicating whether or not the `confirm()` method of the form has
 * been called.
 *
 * @param form - An {@link AbstractForm} to which the hook will subscribe.
 *
 * @returns A React state variable of type `boolean` indicating whether or not
 * the `confirm()` method of the form has been called.
 *
 * @remarks
 * The variable returned by this hook will be updated whenever the
 * `confirmationAttempted` property of the form is updated.
 */
export function useConfirmationAttempted<
  T extends AbstractForm<string, FormConstituents>,
>(form: T): boolean {
  const [confirmationAttempted, setConfirmationAttempted] = useState<boolean>(
    form.confirmationAttempted,
  );

  useEffect(() => {
    const subscription = form.subscribeToConfirmationAttempted(
      updatedConfirmationAttempted => {
        setConfirmationAttempted(updatedConfirmationAttempted);
      },
    );
    return () => subscription.unsubscribe();
  });

  return confirmationAttempted;
}
