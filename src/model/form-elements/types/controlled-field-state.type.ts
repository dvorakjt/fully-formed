import type { InteractableState } from '../../shared';
import type { StateWithMessages } from '../../state';

export type ControlledFieldState<Value> =
  | (StateWithMessages<Value> & Partial<InteractableState>)
  | Partial<InteractableState>;
