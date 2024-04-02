import { Adapter } from './adapter';
import type { FormElement } from '../../../form-elements';
import type { DefaultAdapterConstructorArgs } from '../../types';

/**
 * An adapter that is created for each non-transient, non-excludable form
 * element within a form when the form is instantiated.
 *
 * @typeParam Source - A {@link FormElement} whose state the adapter will
 * subscribe to and adapt. The Name of the adapter and the type of value it will
 * produce are also identical to those of its source.
 */
export class DefaultAdapter<Source extends FormElement> extends Adapter<
  Source['name'],
  Source,
  Source['state']['value']
> {
  public constructor({
    source,
    adaptFn,
  }: DefaultAdapterConstructorArgs<Source>) {
    super({
      name: source.name,
      source,
      adaptFn: (sourceState): Source['state']['value'] => {
        return adaptFn ? adaptFn(sourceState.value) : sourceState.value;
      },
    });
  }
}
