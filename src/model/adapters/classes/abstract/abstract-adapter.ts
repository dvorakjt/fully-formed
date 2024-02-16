import type { Subscription } from 'rxjs';
import type { FormElement } from '../../../form-elements';
import type { AbstractFieldGroup } from '../../../field-groups';
import type { FieldGroupMembers } from '../../../field-groups';
import type {
  Exclude,
  Nameable,
  PossiblyExcludable,
  Stateful,
} from '../../../shared';
import type { AdapterState } from '../../types';

export abstract class AbstractAdapter<
    Name extends string,
    Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
    Value,
    Excludable extends boolean,
  >
  implements
    Nameable<Name>,
    Stateful<AdapterState<Value | null, Excludable>>,
    PossiblyExcludable<Excludable>
{
  public abstract name: Name;
  public abstract source: Source;
  public abstract state: AdapterState<Value | null, Excludable>;
  public abstract excludable: Excludable;
  public abstract exclude: Exclude<Excludable>;
  public abstract subscribeToState(
    cb: (state: AdapterState<Value | null, Excludable>) => void,
  ): Subscription;
}
