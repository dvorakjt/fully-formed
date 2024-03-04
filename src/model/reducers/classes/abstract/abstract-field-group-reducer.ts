import type { Subscription } from 'rxjs';
import type { FieldGroupMembers, FieldGroupValue } from '../../../field-groups';
import type { Stateful } from '../../../shared';
import type { State } from '../../../state';

export abstract class AbstractFieldGroupReducer<
  Members extends FieldGroupMembers,
> implements Stateful<State<FieldGroupValue<Members>>>
{
  public abstract state: State<FieldGroupValue<Members>>;
  public abstract subscribeToState(
    cb: (state: State<FieldGroupValue<Members>>) => void,
  ): Subscription;
}
