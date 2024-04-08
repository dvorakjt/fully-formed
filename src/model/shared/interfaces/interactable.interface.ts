import type { Stateful } from './stateful.interface';
import type { InteractableState } from '../types';

/**
 * Represents an entity that will be represented in the UI with an HTML element
 * that may receive user input.
 */
export interface Interactable extends Stateful<InteractableState> {
  focus(): void;
  visit(): void;
}
