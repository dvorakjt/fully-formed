import type { Stateful } from '../../shared';

export type ModifiableState = {
  hasBeenModified: boolean;
};

export interface Modifiable extends Stateful<ModifiableState> {}
