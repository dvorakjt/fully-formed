import type { Stateful } from '../../shared/interfaces/stateful.interface';

export type SubmittableState = {
  submitted: boolean;
};

export interface Submittable extends Stateful<SubmittableState> {
  setSubmitted(): void;
}
