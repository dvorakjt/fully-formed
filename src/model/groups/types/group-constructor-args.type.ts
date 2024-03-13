import type { GroupMembers } from './group-members.type';
import type { GroupValue } from './group-value.type';
import type {
  AbstractValidator,
  AbstractAsyncValidator,
  ValidatorTemplate,
  AsyncValidatorTemplate,
} from '../../validators';

export type GroupConstructorArgs<
  Name extends string,
  Members extends GroupMembers,
> = {
  name: Name;
  members: Members;
  validators?: Array<AbstractValidator<GroupValue<Members>>>;
  asyncValidators?: Array<AbstractAsyncValidator<GroupValue<Members>>>;
  validatorTemplates?: Array<ValidatorTemplate<GroupValue<Members>>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<GroupValue<Members>>>;
  pendingMessage?: string;
};
