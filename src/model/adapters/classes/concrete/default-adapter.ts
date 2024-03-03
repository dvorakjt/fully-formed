import { Adapter } from '.';
import type { FormElement } from '../../../form-elements';
import type { DefaultAdapterConstructorArgs } from '../../types';

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
