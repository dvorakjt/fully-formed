import type { ValueReducerMemberState } from '../..';

/**
 * Processes the states of elements whose `state` property contains a `value`
 * property and reduces those states into a single value whose keys are the 
 * names of its members and whose values are those members' values. Casts this 
 * value as type `T`.
 * 
 * @typeParam T - The type to which to cast this class's `value` property.
 */
export abstract class AbstractValueReducer<T extends Record<string, unknown>> {
  public abstract value: T;
  public abstract processMemberStateUpdate(
    name: string,
    state: ValueReducerMemberState,
  ): void;
}
