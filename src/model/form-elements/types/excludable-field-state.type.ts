import type { FieldState } from './field-state.type';
import type { ExcludableState } from '../../shared';

export type ExcludableFieldState<Value> = FieldState<Value> & ExcludableState;
