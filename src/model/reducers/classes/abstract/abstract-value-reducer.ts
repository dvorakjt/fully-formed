import type { ValueReducerMemberState } from '../..';

export abstract class AbstractValueReducer<T extends Record<string, unknown>> {
  public abstract value: T;
  public abstract processMemberStateUpdate(
    name: string,
    state: ValueReducerMemberState,
  ): void;
}
