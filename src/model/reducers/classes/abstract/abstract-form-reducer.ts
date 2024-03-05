import type { Subscription } from 'rxjs';
import type { AbstractAdapter } from '../../../adapters';
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type { FormElement } from '../../../form-elements';
import type { Stateful } from '../../../shared';
import type { FormReducerState } from '../../types';

export abstract class AbstractFormReducer<
  FormElements extends readonly FormElement[],
  Adapters extends ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >,
> implements Stateful<FormReducerState<FormElements, Adapters>>
{
  public abstract state: FormReducerState<FormElements, Adapters>;
  public abstract subscribeToState(
    cb: (state: FormReducerState<FormElements, Adapters>) => void,
  ): Subscription;
}
