import type { GroupMembers } from './group-members.type';
import type { GroupValue } from './group-value.type';
import type {
  AbstractValidator,
  AbstractAsyncValidator,
  ValidatorTemplate,
  AsyncValidatorTemplate,
} from '../../validators';
import type { UniquelyNamed } from '../../shared';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Group, AbstractGroup } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement } from '../../form-elements';

/**
 * An object passed as an argument to the constructor of a {@link Group}.
 *
 * @typeParam Name - A string literal which will become the key given to the
 * group in the `groups` property of its parent form. Also becomes the key given
 * to the value of the group if it is included in a {@link GroupValue} object.
 * 
 * @typeParam Members - A readonly array of {@link FormElement}s and/or
 * {@link AbstractGroup}s. The value of each member's `name` property must be
 * unique within the array.
 */
export type GroupConstructorArgs<
  Name extends string,
  Members extends GroupMembers & UniquelyNamed<Members>,
> = {
  name: Name;
  members: Members;
  validators?: Array<AbstractValidator<GroupValue<Members>>>;
  asyncValidators?: Array<AbstractAsyncValidator<GroupValue<Members>>>;
  validatorTemplates?: Array<ValidatorTemplate<GroupValue<Members>>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<GroupValue<Members>>>;
  pendingMessage?: string;
};
