import type { Subscription } from 'rxjs';
import type { Nameable, Stateful } from '../../../shared';
import type {
  GroupMembers,
  GroupState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GroupValue,
} from '../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement } from '../../../form-elements';

/**
 * Provides a means of validating a collection of {@link FormElement}s and/or
 * {@link AbstractGroup}s as a group.
 *
 * @typeParam Name - A string literal which will become the key given to the
 * group in the `groups` property of its parent form. Also becomes the key given
 * to the value of the group if it is included in a {@link GroupValue} object.
 *
 * @typeParam Members - A readonly array of {@link FormElement}s and/or
 * {@link AbstractGroup}s.
 */
export abstract class AbstractGroup<
    Name extends string,
    Members extends GroupMembers,
  >
  implements Nameable<Name>, Stateful<GroupState<Members>>
{
  public abstract name: Name;
  public abstract members: Members;
  public abstract state: GroupState<Members>;
  /**
   * Executes a callback function whenever the state of the group changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * group changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(
    cb: (state: GroupState<Members>) => void,
  ): Subscription;
}
