/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Stateful } from '../../shared';
import type { AbstractAsyncValidator } from '../../validators';

/**
 * Defines possible values for the `validity` property of the `state` property
 * of a class implementing the {@link Stateful} interface.
 *
 * @remarks
 * {@link Validity.Pending} indicates that one or more
 * {@link AbstractAsyncValidator}s applied to a class implementing the
 * {@link Stateful} interface have yet to resolve.
 */
export enum Validity {
  Invalid = 'invalid',
  Pending = 'pending',
  Valid = 'valid',
}
