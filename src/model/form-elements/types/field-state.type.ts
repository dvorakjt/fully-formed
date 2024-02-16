import type { StateWithMessages } from '../../state';
import type { ExcludableState } from '../../shared';

export type FieldState<
  Value,
  Excludable extends boolean,
> = StateWithMessages<Value> &
  ExcludableState<Excludable> & {
    focused: boolean;
    visited: boolean;
    modified: boolean;
  };
