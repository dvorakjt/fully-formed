import { AbstractAdapter } from './abstract-adapter';
import type { Subscription } from 'rxjs';
import type {
  AbstractFieldGroup,
  FieldGroupMembers,
} from '../../../field-groups';
import type { FormElement } from '../../../form-elements';
import type { Excludable } from '../../../shared';
import type { ExcludableAdapterState } from '../../types';

export abstract class AbstractExcludableAdapter<
    Name extends string,
    Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
    Value,
  >
  extends AbstractAdapter<Name, Source, Value>
  implements Excludable
{
  public abstract state: ExcludableAdapterState<Value>;
  public abstract subscribeToState(
    cb: (state: ExcludableAdapterState<Value>) => void,
  ): Subscription;
}
