import type { Stateful } from '../../shared';

export type SubmittableState = {
  submitted: boolean;
};

export interface Submittable extends Stateful<SubmittableState> {
  setSubmitted(): void;
}
