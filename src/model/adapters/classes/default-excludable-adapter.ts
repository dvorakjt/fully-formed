import { ExcludableAdapter } from './excludable-adapter';
import type { Nameable, Validated, Excludable, ValueOf } from '../../shared';
import type {
  DefaultAdapterConstructorParams,
  ExcludableAdaptFnReturnType,
} from '../types';

export class DefaultExcludableAdapter<
  T extends Nameable & Validated<unknown> & Excludable,
> extends ExcludableAdapter<T['name'], T, ValueOf<T>> {
  public constructor({ source, adaptFn }: DefaultAdapterConstructorParams<T>) {
    super({
      name: source.name,
      source,
      adaptFn: (sourceState): ExcludableAdaptFnReturnType<ValueOf<T>> => {
        return {
          value: adaptFn ? adaptFn(sourceState.value) : sourceState.value,
          exclude: sourceState.exclude,
        };
      },
    });
  }
}
