import type { AnyForm } from './any-form.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement } from './form-element.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AbstractForm } from '../classes';

/**
 * A type that can be intersected with a type that extends {@link FormElement}
 * to ensure that that type is a member of the `formElements` property of an
 * {@link AbstractForm}.
 */
export type ConstituentOfForm<
  T extends AnyForm,
  V extends 'formElements' | 'groups' | 'derivedValues',
> = T[V][keyof T[V]];
