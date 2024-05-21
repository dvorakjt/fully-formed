import type { Nameable, Stateful } from '../../shared';

type ValueReducerMemberState = {
  value: unknown;
  exclude?: boolean;
};

type ValueReducerMember = Nameable & Stateful<ValueReducerMemberState>;

type ValueReducerConstructorParams = {
  members: readonly ValueReducerMember[];
};

export class ValueReducer<T extends Record<string, unknown>> {
  private _value: Record<string, unknown>;

  public get value(): T {
    return this._value as T;
  }

  public constructor({ members }: ValueReducerConstructorParams) {
    this._value = {};
    members.forEach((member: ValueReducerMember) => {
      if (!member.state.exclude) {
        this._value[member.name] = member.state.value;
      }
    });
  }

  public processMemberStateUpdate(
    name: string,
    state: ValueReducerMemberState,
  ): void {
    if (state.exclude) {
      delete this._value[name];
    } else {
      this._value[name] = state.value;
    }
  }
}
