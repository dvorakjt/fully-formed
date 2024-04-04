import type { DeriveFn } from './derive-fn.type';
import type { Stateful } from '../../shared';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DerivedValue } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement } from '../../form-elements';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AbstractGroup } from '../../groups';

/**
 * An object passed as an argument to the constructor of a {@link DerivedValue}.
 *
 * @typeParam Name - A string literal which will become the key given to the
 * {@link DerivedValue} in the derivedValues property of the enclosing form.
 *
 * @typeParam Sources - A readonly array of {@link FormElement}s and/or
 * {@link AbstractGroup}s whose state the {@link DerivedValue} will subscribe to
 * and pass into its {@link DeriveFn}.
 *
 * @typeParam Value - The type of value that the {@link DerivedValue} produces.
 */
export type DerivedValueConstructorArgs<
  Name extends string,
  Sources extends ReadonlyArray<Stateful<unknown>>,
  V,
> = {
  /**
   * A string literal which will become the key given to the
   * {@link DerivedValue} in the derivedValues property of the enclosing form.
   */
  name: Name;
  /**
   * A readonly array of {@link FormElement}s and/or
   * {@link AbstractGroup}s whose state the {@link DerivedValue} will subscribe
   * to and pass into its {@link DeriveFn}.
   */
  sources: Sources;
  /**
   * Produces a value from an array of form element and/or group states. The
   * value of the {@link DerivedValue} is produced by calling this function with
   * the states of its sources.
   */
  deriveFn: DeriveFn<Sources, V>;
};
