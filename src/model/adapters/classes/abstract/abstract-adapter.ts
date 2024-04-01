import type { Subscription } from 'rxjs';
import type { FormElement } from '../../../form-elements';
import type { AbstractGroup } from '../../../groups';
import type { GroupMembers } from '../../../groups';
import type { Nameable, Stateful } from '../../../shared';
import type { State } from '../../../state';

/**
 * Adapts a value originating from a form element or group into a new value to be included
 * in the value of a form.
 * 
 * @typeParam Name - A string literal which will be the name given to the adapted value in the
 * value of the form.
 * 
 * @typeParam Source - A FormElement or AbstractGroup whose value the adapter will
 * subscribe to and adapt.
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
