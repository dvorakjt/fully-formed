/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FormTemplate } from '../classes';
import { FormFactory } from '../../factories';

/**
 * An interface that may be implemented by a class extending
 * {@link FormTemplate} in order to specify whether a class created with the
 * `createSubForm()` or `createExcludableSubForm()` methods of the
 * {@link FormFactory} class should be transient.
 */
export interface TransientTemplate<Transient extends boolean> {
  transient: Transient;
}
