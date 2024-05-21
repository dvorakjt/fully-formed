import {
  CombinedValidatorSuite,
  type AsyncValidatorTemplate,
  type IAsyncValidator,
  type IValidator,
  type ValidatorTemplate,
} from '../../validators';
import { GroupReducer } from '../../reducers';
import {
  StateManager,
  Validity,
  type MessageBearer,
  type Message,
  type UniquelyNamed,
} from '../../shared';
import { GroupValiditySource } from '../enums';
import type { Subscription } from 'rxjs';
import type { IGroup, GroupMember } from '../interfaces';
import type { GroupState, GroupValue } from '../types';

type GroupConstructorParams<
  T extends string,
  U extends readonly GroupMember[] & UniquelyNamed<U>,
> = {
  name: T;
  members: U;
  validators?: Array<IValidator<GroupValue<U>>>;
  validatorTemplates?: Array<ValidatorTemplate<GroupValue<U>>>;
  asyncValidators?: Array<IAsyncValidator<GroupValue<U>>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<GroupValue<U>>>;
  pendingMessage?: string;
};

export class Group<
    T extends string,
    const U extends readonly GroupMember[] & UniquelyNamed<U>,
  >
  implements IGroup<T, U>, MessageBearer
{
  public readonly name: T;
  private reducer: GroupReducer<U>;
  private validatorSuite: CombinedValidatorSuite<GroupValue<U>>;
  private stateManager: StateManager<GroupState<U>>;
  private validatorSuiteSubscription?: Subscription;

  public get state(): GroupState<U> {
    return this.stateManager.state;
  }

  private set state(state: GroupState<U>) {
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
  }: GroupConstructorParams<T, U>) {
    this.name = name;
    this.reducer = new GroupReducer<U>({ members });
    this.validatorSuite = new CombinedValidatorSuite<GroupValue<U>>({
      validators,
      asyncValidators,
      validatorTemplates,
      asyncValidatorTemplates,
      pendingMessage,
    });
    if (this.reducer.state.validity !== Validity.Valid) {
      const initialState: GroupState<U> = {
        ...this.reducer.state,
        messages: [],
        validitySource: GroupValiditySource.Reduction,
      };
      this.stateManager = new StateManager<GroupState<U>>(initialState);
    } else {
      const { syncResult, observableResult } = this.validatorSuite.validate(
        this.reducer.state.value,
      );
      const initialState: GroupState<U> = {
        ...syncResult,
        validitySource: GroupValiditySource.Validation,
      };
      this.stateManager = new StateManager<GroupState<U>>(initialState);
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

  public subscribeToState(cb: (state: GroupState<U>) => void): Subscription {
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
