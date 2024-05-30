import type { Stateful } from '../../shared';

export type FocusableState = {
  isInFocus: boolean;
  hasBeenBlurred: boolean;
};

export interface Focusable extends Stateful<FocusableState> {
  focus(): void;
  blur(): void;
  cancelFocus(): void;
}
