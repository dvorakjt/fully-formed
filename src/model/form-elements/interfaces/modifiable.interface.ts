export type ModifiableState = {
  hasBeenModified: boolean;
};

export interface Modifiable {
  state: ModifiableState;
}
