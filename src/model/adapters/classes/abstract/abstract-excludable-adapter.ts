import { AbstractAdapter } from './abstract-adapter';
import type { Subscription } from 'rxjs';
import type { AbstractGroup, GroupMembers } from '../../../groups';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement, FormValue } from '../../../form-elements';
import type { Excludable } from '../../../shared';
import type { ExcludableAdapterState } from '../../types';

/**
 * Adapts a value originating from a form element or group into a new value to
 * be included in the value of a form. This type of adapter may be excluded from
 * the value of the form.
 *
 * @typeParam Name - A string literal which will be the key given to the adapted
 * value within a {@link FormValue} object.
 *
 * @typeParam Source - A {@link FormElement} or {@link AbstractGroup} whose
 * state the adapter will subscribe to and adapt.
 *
 * @typeParam Value - The type of value that the adapter produces.
 */
export abstract class AbstractExcludableAdapter<
    Name extends string,
    Source extends FormElement | AbstractGroup<string, GroupMembers>,
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
