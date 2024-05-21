import type { Merged, MessageBearer, MessageBearerState } from '../../shared';
import type { FormChild, FormChildState } from './form-child.interface';
import type { Focusable, FocusableState } from './focusable.interface';
import type { Modifiable, ModifiableState } from './modifiable.interface';
import type { SetValue } from './set-value.interface';
import type { Submittable } from './submittable.interface';
import type { Identifiable } from './identifiable.interface';

export type FieldState<T = unknown> = FormChildState<T> &
  MessageBearerState &
  FocusableState &
  ModifiableState;

export interface IField<
  T extends string = string,
  U = unknown,
  V extends boolean = boolean,
> extends Merged<
    FormChild<T, U, V> &
      MessageBearer &
      Focusable &
      Modifiable &
      SetValue<U> &
      Submittable &
      Identifiable
  > {}
