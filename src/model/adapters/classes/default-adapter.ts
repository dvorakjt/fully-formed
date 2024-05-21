import { Adapter } from './adapter';
import type { Nameable, Validated, ValueOf } from '../../shared';
import type { DefaultAdapterConstructorParams } from '../types';

export class DefaultAdapter<
  T extends Nameable & Validated<unknown>,
> extends Adapter<T['name'], T, ValueOf<T>> {
  public constructor({ source, adaptFn }: DefaultAdapterConstructorParams<T>) {
    super({
      name: source.name,
      source,
      adaptFn: (sourceState): ValueOf<T> => {
        return adaptFn ? adaptFn(sourceState.value) : sourceState.value;
      },
    });
  }
}
