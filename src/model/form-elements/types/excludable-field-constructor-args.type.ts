import type {
  AbstractAsyncValidator,
  AbstractValidator,
  AsyncValidatorTemplate,
  ValidatorTemplate,
} from '../../validators';
import type { FormElement } from './form-element.type';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableFieldControlTemplate } from './excludable-field-control-template.type';

export type ExcludableFieldConstructorArgs<
  Name extends string,
  Value,
  Transient extends boolean,
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
> = {
  name: Name;
  defaultValue: Value;
  id?: string;
  transient?: Transient;
  validators?: Array<AbstractValidator<Value>>;
  validatorTemplates?: Array<ValidatorTemplate<Value>>;
  asyncValidators?: Array<AbstractAsyncValidator<Value>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<Value>>;
  pendingMessage?: string;
  controlledBy?: ExcludableFieldControlTemplate<Controllers, Value>;
  focusedByDefault?: boolean;
  visitedByDefault?: boolean;
  modifiedByDefault?: boolean;
  excludeByDefault?: boolean;
};
