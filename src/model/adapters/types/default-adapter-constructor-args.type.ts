import type { FormElement } from '../../form-elements';
import type { DefaultAdaptFn } from './default-adapt-fn.type';

export type DefaultAdapterConstructorArgs<Source extends FormElement> = {
  source: Source;
  adaptFn?: DefaultAdaptFn<Source>;
};
