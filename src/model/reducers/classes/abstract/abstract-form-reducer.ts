import type { Subscription } from 'rxjs';
import type { Stateful } from '../../../shared';
import type { FormReducerState } from '../../types';
import type {
  FormConstituents,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FormValue,
} from '../../../form-elements';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Validity } from '../../../state';

/**
 * Produces a {@link FormValue} object and corresponding {@link Validity} based
 * on the states of {@link FormConstituents}.
 */
export abstract class AbstractFormReducer<Constituents extends FormConstituents>
  implements Stateful<FormReducerState<Constituents>>
{
  public abstract state: FormReducerState<Constituents>;
  /**
   * Executes a callback function whenever the state of the
   * {@link AbstractFormReducer} changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * {@link AbstractFormReducer} changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(
    cb: (state: FormReducerState<Constituents>) => void,
  ): Subscription;
}
