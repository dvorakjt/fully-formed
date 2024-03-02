import type { Excludable } from '../..';

export interface ExcludableFormElement extends Excludable {
  setExclude(exclude: boolean): void;
}
