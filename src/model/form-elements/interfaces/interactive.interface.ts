import type { Merged } from '../../shared';
import type { Focusable, FocusableState } from './focusable.interface';
import type { Modifiable, ModifiableState } from './modifiable.interface';
import type { Submittable, SubmittableState } from './submittable.interface';

export type InteractiveState = FocusableState &
  ModifiableState &
  SubmittableState;

export interface Interactive
  extends Merged<Focusable & Modifiable & Submittable> {}
