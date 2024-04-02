import type { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement, FormValue } from '../../../form-elements';
import type { AbstractGroup } from '../../../groups';
import type { GroupMembers } from '../../../groups';
import type { Nameable, Stateful } from '../../../shared';
import type { State } from '../../../state';

/**
 * Adapts a value originating from a form element or group into a new value to
 * be included in the value of a form.
 *
 * @typeParam Name - A string literal which will be the key given to the adapted
 * value within a {@link FormValue} object.
 *
 * @typeParam Source - A {@link FormElement} or {@link AbstractGroup} whose
 * state the adapter will subscribe to and adapt.
 *
 * @typeParam Value - The type of value that the adapter produces.
 */
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
