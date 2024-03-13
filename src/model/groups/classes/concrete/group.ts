import { AbstractGroup } from '../abstract';
import {
  CombinedValidatorSuite,
  type AbstractCombinedValidatorSuite,
} from '../../../validators';
import { GroupReducer, type AbstractGroupReducer } from '../../../reducers';
import {
  StateManager,
  Validity,
  type AbstractStateManager,
  type Message,
} from '../../../state';
import type { Subscription } from 'rxjs';
import type {
  GroupMembers,
  GroupState,
  GroupConstructorArgs,
  GroupValue,
} from '../../types';
import { GroupValiditySource } from '../..';

export class Group<
  Name extends string,
  const Members extends GroupMembers,
> extends AbstractGroup<Name, Members> {
  public readonly name: Name;
  public readonly members: Members;
  private reducer: AbstractGroupReducer<Members>;
  private validatorSuite: AbstractCombinedValidatorSuite<GroupValue<Members>>;
  private stateManager: AbstractStateManager<GroupState<Members>>;
  private validatorSuiteSubscription?: Subscription;

  public get state(): GroupState<Members> {
    return this.stateManager.state;
  }

  private set state(state: GroupState<Members>) {
    this.stateManager.state = state;
  }

  public constructor({
    name,
    members,
    validators,
    asyncValidators,
    validatorTemplates,
    asyncValidatorTemplates,
    pendingMessage,
  }: GroupConstructorArgs<Name, Members>) {
    super();
    this.name = name;
    this.members = members;
    this.reducer = new GroupReducer<Members>({ members });
    this.validatorSuite = new CombinedValidatorSuite<GroupValue<Members>>({
      validators,
      asyncValidators,
      validatorTemplates,
      asyncValidatorTemplates,
      pendingMessage,
    });
    if (this.reducer.state.validity !== Validity.Valid) {
      const initialState: GroupState<Members> = {
        ...this.reducer.state,
        messages: [],
        validitySource: GroupValiditySource.Reduction,
      };
      this.stateManager = new StateManager<GroupState<Members>>(initialState);
    } else {
      const { syncResult, observableResult } = this.validatorSuite.validate(
        this.reducer.state.value,
      );
      const initialState: GroupState<Members> = {
        ...syncResult,
        validitySource: GroupValiditySource.Validation,
      };
      this.stateManager = new StateManager<GroupState<Members>>(initialState);
      this.validatorSuiteSubscription = observableResult?.subscribe(result => {
        this.state = {
          ...result,
          messages: [...this.getNonPendingMessages(), ...result.messages],
          validitySource: GroupValiditySource.Validation,
        };
      });
    }
    this.subscribeToReducer();
  }

  public subscribeToState(
    cb: (state: GroupState<Members>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private subscribeToReducer(): void {
    this.reducer.subscribeToState(state => {
      this.validatorSuiteSubscription?.unsubscribe();
      if (state.validity !== Validity.Valid) {
        this.state = {
          ...state,
          messages: [],
          validitySource: GroupValiditySource.Reduction,
        };
      } else {
        const { syncResult, observableResult } = this.validatorSuite.validate(
          state.value,
        );
        this.state = {
          ...syncResult,
          validitySource: GroupValiditySource.Validation,
        };
        this.validatorSuiteSubscription = observableResult?.subscribe(
          result => {
            this.state = {
              ...result,
              messages: [...this.getNonPendingMessages(), ...result.messages],
              validitySource: GroupValiditySource.Validation,
            };
          },
        );
      }
    });
  }

  private getNonPendingMessages(): Message[] {
    return this.state.messages.filter(m => m.validity !== Validity.Pending);
  }
}
