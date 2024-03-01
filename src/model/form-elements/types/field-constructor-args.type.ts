import type {
  AbstractAsyncValidator,
  AbstractValidator,
  AsyncValidatorTemplate,
  ValidatorTemplate,
} from '../../validators';
import type { FieldControllersAndControlFn } from './field-controllers-and-control-fn.type';
import type { FormElement } from './form-element.type';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';

export type FieldConstructorArgs<
  Name extends string,
  Value,
  Transient extends boolean,
  Controllers extends ReadonlyArray<
    FormElement | AbstractFieldGroup<string, FieldGroupMembers>
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
  controlledBy?: FieldControllersAndControlFn<Controllers, Value>;
  focusedByDefault?: boolean;
  visitedByDefault?: boolean;
  modifiedByDefault?: boolean;
};
