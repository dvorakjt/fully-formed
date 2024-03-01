import type { Stateful } from './stateful.interface';
import type { ExcludableState } from '../types';

export interface Excludable extends Stateful<ExcludableState> {
  setExclude(exclude: boolean): void;
}
