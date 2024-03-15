import type { FormTemplate, SubFormTemplate } from '../../templates';

export type TransienceFromTemplate<T extends FormTemplate> =
  T extends SubFormTemplate ?
    T['transient'] extends boolean ?
      T['transient']
    : false
  : false;
