import type { State } from '../../state';
import type { ExcludableState } from '../../shared';

export interface AdapterState<Value, Excludable extends boolean>
  extends State<Value>,
    ExcludableState<Excludable> {}
