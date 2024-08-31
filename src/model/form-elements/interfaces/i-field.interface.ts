import type {
  MessageBearer,
  MessageBearerState,
  Nameable,
  Validated,
  Merged,
} from '../../shared';
import type { FormChildState } from './form-child.interface';
import type { Focusable, FocusableState } from './focusable.interface';
import type { Modifiable, ModifiableState } from './modifiable.interface';
import type { SetValue } from './set-value.interface';
import type { SetValidityAndMessages } from './set-validity-and-messages';
import type { Submittable, SubmittableState } from './submittable.interface';
import type { Identifiable } from './identifiable.interface';
import type { PossiblyTransient } from './possibly-transient.interface';
import type { Resettable } from './resettable.interface';

export type FieldState<T = unknown> = FormChildState<T> &
  MessageBearerState &
  FocusableState &
  SubmittableState &
  ModifiableState;

export interface IField<
  T extends string = string,
  U = unknown,
  V extends boolean = boolean,
> extends Merged<
    Nameable<T> &
      PossiblyTransient<V> &
      Validated<U> &
      MessageBearer &
      Focusable &
      Modifiable &
      Submittable &
      SetValue<U> &
      SetValidityAndMessages &
      Identifiable &
      Resettable
  > {}
