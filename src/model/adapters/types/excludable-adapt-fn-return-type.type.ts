// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExcludableAdaptFn } from './excludable-adapt-fn.type';

/**
 * An object returned by an {@link ExcludableAdaptFn}.
 *
 * @remarks
 * The `value` and `exclude` properties of this object are assigned to the
 * corresponding properties of the state of an excludable adapter.
 */
export type ExcludableAdaptFnReturnType<Value> = {
  value: Value;
  exclude: boolean;
};
