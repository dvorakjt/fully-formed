import { useMultiPipe } from './use-multi-pipe';
import type { MessageBearer, Message } from '../model';

/**
 * Accepts any number of instances of {@link MessageBearer} and returns an
 * array of their messages as a React state variable. Useful for displaying the
 * messages of multiple {@link MessageBearer}s in one place in the UI.
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
