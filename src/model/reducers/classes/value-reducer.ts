import clone from 'just-clone';
import type {
  ExcludableState,
  Nameable,
  StateWithChanges,
  Validated,
  ValidatedState,
} from '../../shared';

type ValueReducerMember = Nameable & Validated;

type ValueReducerConstructorParams = {
  members: readonly ValueReducerMember[];
};

type ValueReducerState<T extends Record<string, unknown>> = {
  value: T;
  didValueChange: boolean;
};

export class ValueReducer<T extends Record<string, unknown>> {
  private _state: {
    value: Record<string, unknown>;
    didValueChange: boolean;
  };

  public get state(): ValueReducerState<T> {
    return this._state as ValueReducerState<T>;
  }

  public constructor({ members }: ValueReducerConstructorParams) {
    this._state = {
      value: {},
      didValueChange: false,
    };
    members.forEach((member: ValueReducerMember) => {
      if (!('exclude' in member.state) || !member.state.exclude) {
        this._state.value[member.name] = member.state.value;
      }
    });
  }

  public processMemberStateUpdate(
    name: string,
    state: StateWithChanges<ValidatedState>,
  ): void {
    if (!this.didValueChange(state)) {
      this._state.didValueChange = false;
      return;
    }

    this._state.didValueChange = true;

    if ('exclude' in state && state.exclude) {
      delete this._state.value[name];
    } else {
      this._state.value[name] =
        !!state.value && typeof state.value === 'object' ?
          clone(state.value)
        : state.value;
    }
  }

  private didValueChange(state: StateWithChanges<ValidatedState>): boolean {
    if (this.isExcludableState(state)) {
      return (
        (!state.exclude && state.didPropertyChange('value')) ||
        state.didPropertyChange('exclude')
      );
    }

    return state.didPropertyChange('value');
  }

  private isExcludableState(
    state: StateWithChanges<ValidatedState>,
  ): state is StateWithChanges<ValidatedState & ExcludableState> {
    return 'exclude' in state;
  }
}
