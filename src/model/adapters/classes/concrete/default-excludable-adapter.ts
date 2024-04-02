import { ExcludableAdapter } from './excludable-adapter';
import type {
  ExcludableFormElement,
  FormElement,
} from '../../../form-elements';
import type {
  DefaultAdapterConstructorArgs,
  ExcludableAdaptFnReturnType,
} from '../../types';

/**
 * An adapter that is created for each non-transient, excludable form
 * element within a form when the form is instantiated.
 *
 * @typeParam Source - A {@link FormElement} whose state the adapter will
 * subscribe to and adapt. The Name of the adapter and the type of value it will
 * produce are also identical to those of its source.
 *
 * @remarks
 * The exclude property of the state of the adapter is controlled by the exclude
 * property of the state of the source.
 */
export class DefaultExcludableAdapter<
  Source extends FormElement & ExcludableFormElement,
> extends ExcludableAdapter<Source['name'], Source, Source['state']['value']> {
  public constructor({
    source,
    adaptFn,
  }: DefaultAdapterConstructorArgs<Source>) {
    super({
      name: source.name,
      source,
      adaptFn: (
        sourceState,
      ): ExcludableAdaptFnReturnType<Source['state']['value']> => {
        return {
          value: adaptFn ? adaptFn(sourceState.value) : sourceState.value,
          exclude: sourceState.exclude,
        };
      },
    });
  }
}
