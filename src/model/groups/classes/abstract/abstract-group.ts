import type { Subscription } from 'rxjs';
import type { Nameable, Stateful } from '../../../shared';
import type { GroupMembers, GroupState } from '../../types';

export abstract class AbstractGroup<
    Name extends string,
    Members extends GroupMembers,
  >
  implements Nameable<Name>, Stateful<GroupState<Members>>
{
  public abstract name: Name;
  public abstract members: Members;
  public abstract state: GroupState<Members>;
  public abstract subscribeToState(
    cb: (state: GroupState<Members>) => void,
  ): Subscription;
}
