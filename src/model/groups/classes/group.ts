import { Subject, type Subscription } from 'rxjs';
import {
  CombinedValidatorSuite,
  type AsyncValidatorTemplate,
  type IAsyncValidator,
  type IValidator,
  type ValidatorTemplate,
} from '../../validators';
import { GroupReducer } from '../../reducers';
import {
  Validity,
  type MessageBearer,
  type Message,
  type UniquelyNamed,
} from '../../shared';
import { GroupValiditySource } from '../enums';
import { deepEquals } from '../../utils';
import type { IGroup, GroupMember } from '../interfaces';
import type { GroupState, GroupValue } from '../types';
import type {
  CancelableSubscription,
  MessageBearerState,
  StateWithChanges,
  ValidatedState,
} from '../../shared';
import clone from 'just-clone';

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
  delayAsyncValidatorExecution?: number;
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
  private validatorSuiteSubscription?: CancelableSubscription;
  private _state: GroupState<U>;
  private valueChanged = false;
  private validityChanged = false;
  private validitySourceChanged = false;
  private messagesChanged = false;
  private stateChanges = new Subject<StateWithChanges<GroupState<U>>>();

  public get state(): StateWithChanges<GroupState<U>> {
    return {
      ...this._state,
      didPropertyChange: (prop: keyof GroupState): boolean => {
        switch (prop) {
          case 'value':
            return this.valueChanged;
          case 'validity':
            return this.validityChanged;
          case 'validitySource':
            return this.validitySourceChanged;
          case 'messages':
            return this.messagesChanged;
          default:
            return false;
        }
      },
    };
  }

  public constructor({
    name,
    members,
    validators,
    asyncValidators,
    validatorTemplates,
    asyncValidatorTemplates,
    pendingMessage,
    delayAsyncValidatorExecution,
  }: GroupConstructorParams<T, U>) {
    this.name = name;

    this.reducer = new GroupReducer<U>({ members });

    this.validatorSuite = new CombinedValidatorSuite<GroupValue<U>>({
      validators,
      asyncValidators,
      validatorTemplates,
      asyncValidatorTemplates,
      pendingMessage,
      delayAsyncValidatorExecution,
    });

    if (this.reducer.state.validity !== Validity.Valid) {
      const initialState: GroupState<U> = {
        ...clone(this.reducer.state),
        messages: [],
        validitySource: GroupValiditySource.Reduction,
      };

      this._state = initialState;
    } else {
      const { syncResult, observableResult } = this.validatorSuite.validate(
        clone(this.reducer.state.value),
      );

      const initialState: GroupState<U> = {
        ...syncResult,
        validitySource: GroupValiditySource.Validation,
      };

      this._state = initialState;

      this.validatorSuiteSubscription = observableResult?.subscribe(result => {
        this.processAsyncValidatorSuiteResult(result);
      });
    }

    this.subscribeToReducer();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<GroupState<U>>) => void,
  ): Subscription {
    return this.stateChanges.subscribe(cb);
  }

  private setState(state: GroupState<U>): void {
    this._state = state;
    this.stateChanges.next(this.state);
  }

  private processAsyncValidatorSuiteResult(
    result: ValidatedState<GroupValue<U>> & MessageBearerState,
  ): void {
    this.valueChanged = false;
    this.validityChanged = true;
    this.validitySourceChanged = false;

    const newMessages = [...this.getNonPendingMessages(), ...result.messages];
    this.messagesChanged = !deepEquals(this._state.messages, newMessages);

    this.setState({
      ...result,
      messages: newMessages,
      validitySource: GroupValiditySource.Validation,
    });
  }

  private subscribeToReducer(): void {
    this.reducer.subscribeToState(reducerState => {
      if (reducerState.validity !== Validity.Valid) {
        this.validatorSuiteSubscription?.unsubscribeAndCancel();

        this.valueChanged = reducerState.didPropertyChange('value');
        this.validityChanged = reducerState.validity !== this._state.validity;
        this.validitySourceChanged =
          this._state.validitySource === GroupValiditySource.Validation;
        this.messagesChanged = this._state.messages.length > 0;

        this.setState({
          value:
            this.valueChanged ? clone(reducerState.value) : this.state.value,
          validity: reducerState.validity,
          messages: [],
          validitySource: GroupValiditySource.Reduction,
        });
      } else if (
        reducerState.didPropertyChange('validity') ||
        reducerState.didPropertyChange('value')
      ) {
        this.validatorSuiteSubscription?.unsubscribeAndCancel();

        const { syncResult, observableResult } = this.validatorSuite.validate(
          reducerState.value,
        );

        this.valueChanged = reducerState.didPropertyChange('value');
        this.validityChanged = reducerState.validity !== this._state.validity;
        this.validitySourceChanged =
          this._state.validitySource === GroupValiditySource.Reduction;
        this.messagesChanged = !deepEquals(
          syncResult.messages,
          this._state.messages,
        );

        this.setState({
          ...syncResult,
          validitySource: GroupValiditySource.Validation,
        });

        this.validatorSuiteSubscription = observableResult?.subscribe(
          result => {
            this.processAsyncValidatorSuiteResult(result);
          },
        );
      }
    });
  }

  private getNonPendingMessages(): Message[] {
    return this.state.messages.filter(m => m.validity !== Validity.Pending);
  }
}
