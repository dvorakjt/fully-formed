import { useMultiPipe } from './use-multi-pipe';
import type { MessageBearer, Message } from '../model';

export function useMessages<const T extends readonly MessageBearer[]>(
  ...entities: T
): Message[] {
  return useMultiPipe<T, Message[]>(entities, states =>
    states.map(state => state.messages).flat(),
  );
}
