import { AbstractValueReducer } from '../abstract/abstract-value-reducer';
import type {
  ValueReducerMember,
  ValueReducerConstructorArgs,
  ValueReducerMemberState,
} from '../../types';

/**
 * Processes the states of elements whose `state` property contains a `value`
 * property and reduces those states into a single value whose keys are the
 * names of its members and whose values are those members' values. Casts this
 * value as type `T`.
 *
 * @typeParam T - The type to which to cast this class's `value` property.
 */
export class ValueReducer<
  T extends Record<string, unknown>,
> extends AbstractValueReducer<T> {
  private _value: Record<string, unknown>;

  public get value(): T {
    return this._value as T;
  }

  public constructor({ members }: ValueReducerConstructorArgs) {
    super();
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
