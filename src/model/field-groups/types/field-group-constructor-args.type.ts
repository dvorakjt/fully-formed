import type { FieldGroupMembers } from './field-group-members.type';
import type { FieldGroupValue } from './field-group-value.type';
import type { UniquelyNamed } from '../../shared';
import type {
  AbstractValidator,
  AbstractAsyncValidator,
  ValidatorTemplate,
  AsyncValidatorTemplate,
} from '../../validators';

export type FieldGroupConstructorArgs<
  Name extends string,
  Members extends FieldGroupMembers & UniquelyNamed<Members>,
> = {
  name: Name;
  members: Members;
  validators?: Array<AbstractValidator<FieldGroupValue<Members>>>;
  asyncValidators?: Array<AbstractAsyncValidator<FieldGroupValue<Members>>>;
  validatorTemplates?: Array<ValidatorTemplate<FieldGroupValue<Members>>>;
  asyncValidatorTemplates?: Array<
    AsyncValidatorTemplate<FieldGroupValue<Members>>
  >;
  pendingMessage? : string;
};
