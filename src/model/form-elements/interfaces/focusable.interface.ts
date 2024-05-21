export type FocusableState = {
  isInFocus: boolean;
  hasBeenBlurred: boolean;
};

export interface Focusable {
  state: FocusableState;
  focus(): void;
  blur(): void;
  cancelFocus(): void;
}
