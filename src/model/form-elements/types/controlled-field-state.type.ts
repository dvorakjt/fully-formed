import type { ExcludableState, InteractableState } from '../../shared';
import type { StateWithMessages } from '../../state';

export type ControlledFieldState<Value, Excludable extends boolean> =
  | (StateWithMessages<Value> &
      Partial<InteractableState & ExcludableState<Excludable>>)
  | Partial<InteractableState & ExcludableState<Excludable>>;
