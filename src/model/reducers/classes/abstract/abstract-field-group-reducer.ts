import type { Subscription } from 'rxjs';
import type { FieldGroupMembers } from '../../../field-groups';
import type { Stateful } from '../../../shared';
import type { FieldGroupReducerState } from '../../types/field-group-reducer-state.type';

export abstract class AbstractFieldGroupReducer<
  Members extends FieldGroupMembers,
> implements Stateful<FieldGroupReducerState<Members>>
{
  public abstract state: FieldGroupReducerState<Members>;
  public abstract subscribeToState(
    cb: (state: FieldGroupReducerState<Members>) => void,
  ): Subscription;
}
