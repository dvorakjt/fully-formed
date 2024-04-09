import type { Subscription } from 'rxjs';
import type { Stateful } from '../../../shared';
import type { StatefulArrayStates } from '../../types';

/**
 * Subscribes to an array of instances of classes implementing the 
 * {@link Stateful} interface and maintains an array of their states in its
 * `state` property. Emits updates to this array to subscribers.
 */
export abstract class AbstractStatefulArrayReducer<
  T extends ReadonlyArray<Stateful<unknown>>,
> implements Stateful<StatefulArrayStates<T>>
{
  public abstract state: StatefulArrayStates<T>;
  /**
   * Executes a callback function whenever the state of the 
   * {@link AbstractStatefulArrayReducer} changes.
   *
   * @param cb - The callback function to be executed when the state of the 
   * {@link AbstractStatefulArrayReducer} changes.
   * 
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(
    cb: (state: StatefulArrayStates<T>) => void,
  ): Subscription;
}
