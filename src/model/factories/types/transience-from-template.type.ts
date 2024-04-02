import type { FormTemplate, TransientTemplate } from '../../templates';

export type TransienceFromTemplate<T extends FormTemplate> =
  T extends TransientTemplate<boolean> ? T['transient'] : false;
