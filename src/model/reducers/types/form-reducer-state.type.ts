import type { State } from '../../state';

export type FormReducerState<Value extends Record<string, unknown>> =
  State<Value>;
