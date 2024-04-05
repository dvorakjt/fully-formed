import type {
  AbstractAsyncValidator,
  AbstractValidator,
  AsyncValidatorTemplate,
  ValidatorTemplate,
} from '../../validators';
import type { FormElement } from './form-element.type';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableFieldControlTemplate } from './excludable-field-control-template.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableField } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormValue } from './form-value.type';

/**
 * An object passed as an argument to the constructor of an 
 * {@link ExcludableField}.
 *
 * @typeParam Name - A string literal which will be the key given to the field
 * within the `formElements` property of its parent form, as well as to the
 * value of the field (if non-transient) within a {@link FormValue} object.
 *
 * @typeParam Value - The type of value the field will contain.
 *
 * @typeParam Transient - Represents whether or not the value of the field
 * will be included in the value of its parent form.
 *
 * @typeParam Controllers - A readonly array of form elements and/or groups to
 * which the field will subscribe. If provided, the states of these entities
 * will control the state of the field.
 */
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
