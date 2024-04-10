import { useState, useLayoutEffect } from 'react';
import type { Message, Stateful, StateWithMessages } from '../model';
import type { Subscription } from 'rxjs';

export function useCombinedMessages(
  ...messageBearers: Array<Stateful<StateWithMessages<unknown>>>
): Message[] {
  const [messages, setMessages] = useState(
    messageBearers.map(entity => entity.state.messages).flat(),
  );

  useLayoutEffect(() => {
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
