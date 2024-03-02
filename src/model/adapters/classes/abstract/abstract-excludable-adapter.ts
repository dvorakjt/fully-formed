import { AbstractAdapter } from './abstract-adapter';
import type { Subscription } from 'rxjs';
import type {
  AbstractFieldGroup,
  FieldGroupMembers,
} from '../../../field-groups';
import type { FormElement } from '../../../form-elements';
import type { Excludable, ExcludableState } from '../../../shared';
import type { State } from '../../../state';

export abstract class AbstractExcludableAdapter<
    Name extends string,
    Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
    Value,
  >
  extends AbstractAdapter<Name, Source, Value>
  implements Excludable
{
  public abstract state: State<Value> & ExcludableState;
  public abstract subscribeToState(
    cb: (state: State<Value> & ExcludableState) => void,
  ): Subscription;
}
