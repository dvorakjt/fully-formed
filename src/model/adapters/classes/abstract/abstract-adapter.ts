import type { Subscription } from 'rxjs';
import type { FormElement } from '../../../form-elements';
import type { AbstractGroup } from '../../../groups';
import type { GroupMembers } from '../../../groups';
import type { Nameable, Stateful } from '../../../shared';
import type { State } from '../../../state';

export abstract class AbstractAdapter<
    Name extends string,
    Source extends FormElement | AbstractGroup<string, GroupMembers>,
    Value,
  >
  implements Nameable<Name>, Stateful<State<Value>>
{
  public abstract name: Name;
  public abstract source: Source;
  public abstract state: State<Value>;
  public abstract subscribeToState(
    cb: (state: State<Value>) => void,
  ): Subscription;
}
