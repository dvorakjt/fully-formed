import { useState, useEffect } from 'react';
import type { Message, Stateful, StateWithMessages } from '../model';
import type { Subscription } from 'rxjs';

/**
 * Takes in an array of instances of classes implementing
 * {@link Stateful}\<{@link StateWithMessages}\> and returns a React state
 * variable containing an array of all of those instances' {@link Message}s.
 *
 * @param messageBearers - An array of instances of classes that implement
 * {@link Stateful}\<{@link StateWithMessages}\>.
 *
 * @returns A React state variable containing the {@link Message}s of the
 * `messageBearers`.
 *
 * @remarks
 * The variable returned by this hook will be updated whenever the `state` of
 * any of the `messagesBearers` changes.
 */
export function useCombinedMessages(
  ...messageBearers: Array<Stateful<StateWithMessages<unknown>>>
): Message[] {
  const [messages, setMessages] = useState(
    messageBearers.map(entity => entity.state.messages).flat(),
  );

  useEffect(() => {
    const subscriptions: Subscription[] = [];
    messageBearers.forEach(entity => {
      const subscription = entity.subscribeToState(() => {
        setMessages(messageBearers.map(entity => entity.state.messages).flat());
      });
      subscriptions.push(subscription);
    });
    return () =>
      subscriptions.forEach(subscription => subscription.unsubscribe());
  }, []);

  return messages;
}
