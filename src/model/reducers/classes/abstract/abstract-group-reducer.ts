import type { Subscription } from 'rxjs';
import type { GroupMembers, GroupValue } from '../../../groups';
import type { Stateful } from '../../../shared';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { State, Validity } from '../../../state';

/**
 * Produces a {@link GroupValue} object and corresponding {@link Validity} based
 * on the states of its members.
 */
export abstract class AbstractGroupReducer<Members extends GroupMembers>
  implements Stateful<State<GroupValue<Members>>>
{
  public abstract state: State<GroupValue<Members>>;
  /**
   * Executes a callback function whenever the state of the
   * {@link AbstractGroupReducer} changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * {@link AbstractGroupReducer} changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(
    cb: (state: State<GroupValue<Members>>) => void,
  ): Subscription;
}
