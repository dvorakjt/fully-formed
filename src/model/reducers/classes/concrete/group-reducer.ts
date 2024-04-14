import { AbstractGroupReducer } from '../abstract';
import { ValidityReducer } from './validity-reducer';
import { ValueReducer } from './value-reducer';
import {
  StateManager,
  type State,
  type AbstractStateManager,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Validity,
} from '../../../state';
import type { Subscription } from 'rxjs';
import type { AbstractValueReducer } from '../abstract/abstract-value-reducer';
import type { AbstractValidityReducer } from '../abstract';
import type { GroupMembers, GroupValue } from '../../../groups';
import type { GroupReducerConstructorArgs } from '../../types';

/**
 * Produces a {@link GroupValue} object and corresponding {@link Validity} based
 * on the states of its members.
 */
export class GroupReducer<
  const Members extends GroupMembers,
> extends AbstractGroupReducer<Members> {
  public readonly members: Members;
  private valueReducer: AbstractValueReducer<GroupValue<Members>>;
  private validityReducer: AbstractValidityReducer;
  private stateManager: AbstractStateManager<State<GroupValue<Members>>>;

  public get state(): State<GroupValue<Members>> {
    return this.stateManager.state;
  }

  private set state(state: State<GroupValue<Members>>) {
    this.stateManager.state = state;
  }

  public constructor({ members }: GroupReducerConstructorArgs<Members>) {
    super();
    this.members = members;
    this.valueReducer = new ValueReducer<GroupValue<Members>>({ members });
    this.validityReducer = new ValidityReducer({ members });
    this.stateManager = new StateManager<State<GroupValue<Members>>>({
      value: this.valueReducer.value,
      validity: this.validityReducer.validity,
    });
    this.subscribeToMembers();
  }

  /**
   * Executes a callback function whenever the state of the {@link GroupReducer}
   * changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * {@link GroupReducer} changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToState(
    cb: (state: State<GroupValue<Members>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private subscribeToMembers(): void {
    this.members.forEach(member => {
      member.subscribeToState(state => {
        this.valueReducer.processMemberStateUpdate(member.name, state);
        this.validityReducer.processMemberStateUpdate(member.name, state);
        this.state = {
          value: this.valueReducer.value,
          validity: this.validityReducer.validity,
        };
      });
    });
  }
}
