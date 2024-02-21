import type { Stateful } from './stateful.interface';
import type { InteractableState } from '../types';

export interface Interactable extends Stateful<InteractableState> {
  focus(): void;
  visit(): void;
}
