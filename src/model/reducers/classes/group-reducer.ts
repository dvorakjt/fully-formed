import { Subject, type Subscription } from 'rxjs';
import { ValidityReducer } from './validity-reducer';
import { ValueReducer } from './value-reducer';
import type { StateWithChanges, Validated, ValidatedState } from '../../shared';
import type { GroupMember, GroupValue } from '../../groups';
import clone from 'just-clone';

type GroupReducerConstructorParams<T extends readonly GroupMember[]> = {
  members: T;
};

export class GroupReducer<const T extends readonly GroupMember[]>
  implements Validated<GroupValue<T>>
{
  private members: T;
  private valueReducer: ValueReducer<GroupValue<T>>;
  private validityReducer: ValidityReducer;
  private _state: ValidatedState<GroupValue<T>>;
  private stateChanges: Subject<
    StateWithChanges<ValidatedState<GroupValue<T>>>
  > = new Subject();
  private valueChanged = false;
  private validityChanged = false;

  public get state(): StateWithChanges<ValidatedState<GroupValue<T>>> {
    return {
      ...this._state,
      didPropertyChange: (
        prop: keyof ValidatedState<GroupValue<T>>,
      ): boolean => {
        if (prop === 'value') return this.valueChanged;

        return this.validityChanged;
      },
    };
  }

  public constructor({ members }: GroupReducerConstructorParams<T>) {
    this.members = members;
    this.valueReducer = new ValueReducer<GroupValue<T>>({ members });
    this.validityReducer = new ValidityReducer({ members });

    this._state = {
      value: clone(this.valueReducer.state.value),
      validity: this.validityReducer.validity,
    };

    this.subscribeToMembers();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<ValidatedState<GroupValue<T>>>) => void,
  ): Subscription {
    return this.stateChanges.subscribe(cb);
  }

  private subscribeToMembers(): void {
    this.members.forEach(member => {
      member.subscribeToState(state => {
        this.valueReducer.processMemberStateUpdate(member.name, state);
        this.validityReducer.processMemberStateUpdate(member.name, state);

        this.valueChanged = this.valueReducer.state.didValueChange;
        this.validityChanged =
          this._state.validity !== this.validityReducer.validity;

        this._state = {
          value:
            this.valueChanged ?
              clone(this.valueReducer.state.value)
            : this.state.value,
          validity: this.validityReducer.validity,
        };

        this.stateChanges.next(this.state);
      });
    });
  }
}
