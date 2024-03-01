import type { StateWithMessages } from '../../state';

export type FieldState<Value> = StateWithMessages<Value> & {
  focused: boolean;
  visited: boolean;
  modified: boolean;
};
