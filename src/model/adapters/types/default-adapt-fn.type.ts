import type { AdaptFn } from './adapt-fn.type';
import type { FormElement } from '../../form-elements';

export type DefaultAdaptFn<Source extends FormElement> = AdaptFn<
  Source,
  Source['state']['value']
>;
