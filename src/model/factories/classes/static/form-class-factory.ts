import type { AbstractForm, FormConstructorArgs } from '../../../form-elements';
import { PartialForm } from '../../../form-elements/classes/abstract/partial-form';
import type {
  InitForm,
  AllowedInitFormReturnType,
  InitFormReturnType,
  InitFormReturnTypeToFormConstituents,
} from '../../types';

export class FormClassFactory {
  public static extendForm<
    Args extends unknown[],
    T extends InitFormReturnType & AllowedInitFormReturnType<T>,
  >(
    init: InitForm<Args, T>,
  ): new (
    ...args: Args
  ) => AbstractForm<T['name'], InitFormReturnTypeToFormConstituents<T>> {
    return class extends PartialForm<
      T['name'],
      InitFormReturnTypeToFormConstituents<T>
    > {
      public constructor(...args: Args) {
        super({
          adapters: [],
          groups: [],
          derivedValues: [],
          autoTrim: false,
          ...init(...args),
        } as FormConstructorArgs<
          T['name'],
          InitFormReturnTypeToFormConstituents<T>
        >);
      }
    };
  }
}
