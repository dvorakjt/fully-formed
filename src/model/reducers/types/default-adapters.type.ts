import type { AbstractAdapter } from '../../adapters';
import type { FormElement } from '../../form-elements';
import type { PossiblyTransient } from '../../shared';

export type DefaultAdapters<FormElements extends readonly FormElement[]> = {
  [K in keyof FormElements as FormElements[K] extends PossiblyTransient<false> ?
    K
  : never]: AbstractAdapter<
    FormElements[K]['name'],
    FormElements[K],
    FormElements[K]['state']['value']
  >;
};
