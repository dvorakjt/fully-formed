import type { Subscription } from 'rxjs';
import type { FormElement } from '../../../form-elements';
import type { AbstractFieldGroup } from '../../../field-groups';
import type { FieldGroupMembers } from '../../../field-groups';
import type { Nameable, Stateful } from '../../../shared';
import type { State } from '../../../state';

export abstract class AbstractAdapter<
    Name extends string,
    Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
    Value,
  >
  implements Nameable<Name>, Stateful<State<Value | null>>
{
  public abstract name: Name;
  public abstract source: Source;
  public abstract state: State<Value | null>;
  public abstract subscribeToState(
    cb: (state: State<Value | null>) => void,
  ): Subscription;
}
