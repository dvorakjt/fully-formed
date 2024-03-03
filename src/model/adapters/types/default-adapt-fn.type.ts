import type { FormElement } from '../../form-elements';

export type DefaultAdaptFn<Source extends FormElement> = (
  sourceValue: Source['state']['value'],
) => Source['state']['value'];
