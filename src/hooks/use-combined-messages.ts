import { useState, useLayoutEffect } from 'react';
import type { Message, Stateful, StateWithMessages } from '../model';
import type { Subscription } from 'rxjs';

export function useCombinedMessages(
  ...statefulEntities: Array<Stateful<StateWithMessages<unknown>>>
): Message[] {
  const [messages, setMessages] = useState(
    statefulEntities.map(entity => entity.state.messages).flat(),
  );

  useLayoutEffect(() => {
    const subscriptions: Subscription[] = [];
    statefulEntities.forEach(entity => {
      const subscription = entity.subscribeToState(() => {
        setMessages(
          statefulEntities.map(entity => entity.state.messages).flat(),
        );
      });
      subscriptions.push(subscription);
    });
    return () =>
      subscriptions.forEach(subscription => subscription.unsubscribe());
  }, []);

  return messages;
}
