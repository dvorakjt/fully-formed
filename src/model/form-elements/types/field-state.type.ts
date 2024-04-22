import type { StateWithMessages } from '../../state';
import type { InteractableState } from '../../shared';

export type FieldState<Value> = StateWithMessages<Value> & InteractableState;
