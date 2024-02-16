import type {
  Identifiable,
  Nameable,
  PossiblyExcludable,
  PossiblyTransient,
  Resettable,
  Stateful,
} from '../../shared';
import type { StateWithMessages } from '../../state';

export type FormElement = Nameable<string> &
  Identifiable &
  Stateful<StateWithMessages<unknown>> &
  PossiblyTransient<boolean> &
  PossiblyExcludable<boolean> &
  Resettable;
