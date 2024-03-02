import type { State } from '../../state';
import type { ExcludableState } from '../../shared';

export type ExcludableAdapterState<Value> = State<Value> & ExcludableState;
