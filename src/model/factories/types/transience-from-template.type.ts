import type { FormTemplate, TransientTemplate } from '../../templates';

/**
 * Returns `T['transient']` if `T` extends {@link TransientTemplate}, otherwise
 * returns `false`.
 *
 * @typeParam T - A FormTemplate which may extend {@link TransientTemplate}.
 */
export type TransienceFromTemplate<T extends FormTemplate> =
  T extends TransientTemplate<boolean> ? T['transient'] : false;
