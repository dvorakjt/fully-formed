import { ExcludableAdapter } from './excludable-adapter';
import type {
  ExcludableFormElement,
  FormElement,
} from '../../../form-elements';
import type {
  DefaultAdapterConstructorArgs,
  ExcludableAdaptFnReturnType,
} from '../../types';

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
