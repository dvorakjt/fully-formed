import type { FormElement } from './form-element.type';
import type { AbstractGroup, GroupMembers } from '../../groups';
import type { ExcludableFieldControlFn } from './excludable-field-control-fn.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableField } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableFieldConstructorArgs } from './excludable-field-constructor-args.type';

/**
 * An object which can be provided to the constructor of an
 * {@link ExcludableField} as part of a {@link ExcludableFieldConstructorArgs}
 * object. This object defines an array of form elements and/or groups that the
 * field will subscribe to, and a function which processes those entities'
 * states and returns an object which will be applied to the state of the field.
 *
 * @typeParam Controllers - A readonly array of form elements and/or groups
 * whose states will be processed by the `controlFn`.
 *
 * @typeParam Value - The type of value contained by the field whose constructor
 * received this object as part of its {@link ExcludableFieldConstructorArgs}.
 */
export type ExcludableFieldControlTemplate<
  Controllers extends ReadonlyArray<
    FormElement | AbstractGroup<string, GroupMembers>
  >,
  Value,
> = {
  controllers: Controllers;
  controlFn: ExcludableFieldControlFn<Controllers, Value>;
};
