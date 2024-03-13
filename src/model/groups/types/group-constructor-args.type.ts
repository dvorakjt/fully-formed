import type { GroupMembers } from './group-members.type';
import type { GroupValue } from './group-value.type';
import type {
  AbstractValidator,
  AbstractAsyncValidator,
  ValidatorTemplate,
  AsyncValidatorTemplate,
} from '../../validators';
import type { UniquelyNamed } from '../../shared';

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
