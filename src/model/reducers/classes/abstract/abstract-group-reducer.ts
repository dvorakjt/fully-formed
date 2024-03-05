import type { Subscription } from 'rxjs';
import type { GroupMembers, GroupValue } from '../../../groups';
import type { Stateful } from '../../../shared';
import type { State } from '../../../state';

export abstract class AbstractGroupReducer<Members extends GroupMembers>
  implements Stateful<State<GroupValue<Members>>>
{
  public abstract state: State<GroupValue<Members>>;
  public abstract subscribeToState(
    cb: (state: State<GroupValue<Members>>) => void,
  ): Subscription;
}
