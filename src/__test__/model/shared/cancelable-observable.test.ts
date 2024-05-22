import { describe, test, expect, vi } from 'vitest';
import { CancelableObservable } from '../../../model';
import { delay } from '../../../test-utils';

describe('CancelableObservable', () => {
  test(`It throws a RangeError if the delay it receives is negative.`, () => {
    expect(
      () => new CancelableObservable(subscriber => subscriber.complete(), -1),
    ).toThrow(new RangeError('delay must be non-negative.'));
  });

  test(`It returns an observable that is executed after the provided delay 
  duration.`, async () => {
    const cancelableObservable = new CancelableObservable<number>(
      subscriber => {
        const executionTimestamp = Date.now();
        subscriber.next(executionTimestamp);
        subscriber.complete();
      },
      500,
    );

    const subscriptionTimestamp = Date.now();

    cancelableObservable.subscribe(executionTimestamp => {
      const difference = executionTimestamp - subscriptionTimestamp;

      console.log(
        `CancelableObservable executed subscribe after ${difference}ms.`,
      );

      expect(difference).toBeGreaterThanOrEqual(500);
    });

    await delay(1000);
  });

  test(`If the subscription returned by subscribe is calnceled before the delay 
  duration has elapsed, the subscribe function is not called.`, async () => {
    const subscribe = vi.fn();
    const cancelableObservable = new CancelableObservable(subscribe, 500);
    const subscription = cancelableObservable.subscribe();

    subscription.unsubscribeAndCancel();

    await delay(1000);

    expect(subscribe).not.toHaveBeenCalled();
  });
});
