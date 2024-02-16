import type { Stateful } from './stateful.interface';
import type { Exclude, ExcludableState } from '../types';

export interface PossiblyExcludable<Excludable extends boolean>
  extends Stateful<ExcludableState<Excludable>> {
  excludable: Excludable;
  exclude: Exclude<Excludable>;
}
