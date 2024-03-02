import type { InteractableState, ExcludableState } from '../../shared';
import type { StateWithMessages } from '../../state';

export type ControlledExcludableFieldState<Value> =
  | (StateWithMessages<Value> & Partial<InteractableState & ExcludableState>)
  | Partial<InteractableState & ExcludableState>;
