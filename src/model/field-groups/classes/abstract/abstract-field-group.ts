import type { Subscription } from 'rxjs';
import type { Nameable, Stateful, UniquelyNamed } from '../../../shared';
import type { FieldGroupMembers, FieldGroupState } from '../../types';

export abstract class AbstractFieldGroup<
    Name extends string,
    Members extends FieldGroupMembers & UniquelyNamed<Members>,
  >
  implements Nameable<Name>, Stateful<FieldGroupState<Members>>
{
  public abstract name: Name;
  public abstract members: Members;
  public abstract state: FieldGroupState<Members>;
  public abstract subscribeToState(
    cb: (state: FieldGroupState<Members>) => void,
  ): Subscription;
}
