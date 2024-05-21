import {
  Observable,
  type Observer,
  type Subscriber,
  type Subscription,
  type TeardownLogic,
} from 'rxjs';
import type { CancelableSubscription } from '../interfaces';

type Subscribe<T> = (
  this: Observable<T>,
  subscriber: Subscriber<T>,
) => TeardownLogic;

type ObserverOrNext<T> =
  | Partial<Observer<T>>
  | ((value: T) => void)
  | undefined;

export class CancelableObservable<T> {
  private subscribeFn: Subscribe<T>;
  private delay: number;

  public constructor(subscribeFn: Subscribe<T>, delay: number) {
    this.subscribeFn = subscribeFn;

    if (delay < 0) {
      throw new RangeError('delay must be non-negative.');
    }

    this.delay = delay;
  }

  public subscribe(observer: ObserverOrNext<T>): CancelableSubscription {
    let canceled = false;
    let subscription: Subscription;

    setTimeout(() => {
      if (!canceled) {
        subscription = new Observable(this.subscribeFn).subscribe(observer);
      }
    }, this.delay);

    const unsubscribeAndCancel = (): void => {
      canceled = true;
      subscription?.unsubscribe();
    };

    return {
      unsubscribeAndCancel,
    };
  }
}
