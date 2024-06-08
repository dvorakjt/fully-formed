import { useMultiPipe } from './use-multi-pipe';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MessageBearer, Message, Field, Group } from '../model';

/**
 * Accepts any number of instances of {@link MessageBearer} and returns an
 * array of their messages as a React state variable. Useful for displaying the
 * messages of multiple {@link MessageBearer}s in one place in the UI.
 *
 * For example, this could be used to display the messages of a particular
 * {@link Field} and an associated {@link Group} together, or displaying
 * messages from all {@link Group}s together at the bottom of a form.
 *
 * @param entities - The {@link MessageBearer}s whose messages should be
 * included in the returned array.
 *
 * @returns An array of {@link Message}s.
 */
export function useMessages<const T extends readonly MessageBearer[]>(
  ...entities: T
): Message[] {
  return useMultiPipe<T, Message[]>(entities, states =>
    states.map(state => state.messages).flat(),
  );
}
