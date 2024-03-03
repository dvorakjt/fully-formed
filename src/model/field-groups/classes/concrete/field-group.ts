import { AbstractFieldGroup } from '../abstract';
import {
  CombinedValidatorSuite,
  type AbstractCombinedValidatorSuite,
} from '../../../validators';
import {
  FieldGroupReducer,
  type AbstractFieldGroupReducer,
} from '../../../reducers';
import {
  StateManager,
  type AbstractStateManager,
  Validity,
} from '../../../state';
import type { Subscription } from 'rxjs';
import type { UniquelyNamed } from '../../../shared';
import type {
  FieldGroupMembers,
  FieldGroupValue,
  FieldGroupState,
  FieldGroupConstructorArgs,
} from '../../types';
import { FieldGroupValiditySource } from '../..';

export class FieldGroup<
  Name extends string,
  const Members extends FieldGroupMembers & UniquelyNamed<Members>,
> extends AbstractFieldGroup<Name, Members> {
  public readonly name: Name;
  public readonly members: Members;
  private reducer: AbstractFieldGroupReducer<Members>;
  private validatorSuite: AbstractCombinedValidatorSuite<
    FieldGroupValue<Members>
  >;
  private stateManager: AbstractStateManager<FieldGroupState<Members>>;
  private validatorSuiteSubscription?: Subscription;

  public get state(): FieldGroupState<Members> {
    return this.stateManager.state;
  }

  private set state(state: FieldGroupState<Members>) {
    this.stateManager.state = state;
  }

  public constructor({
    name,
    members,
    validators,
    asyncValidators,
    validatorTemplates,
    asyncValidatorTemplates,
  }: FieldGroupConstructorArgs<Name, Members>) {
    super();
    this.name = name;
    this.members = members;
    this.reducer = new FieldGroupReducer<Members>({ members });
    this.validatorSuite = new CombinedValidatorSuite<FieldGroupValue<Members>>({
      validators,
      asyncValidators,
      validatorTemplates,
      asyncValidatorTemplates,
    });
    if (this.reducer.state.validity !== Validity.Valid) {
      const initialState: FieldGroupState<Members> = {
        ...this.reducer.state,
        messages: [],
        validitySource: FieldGroupValiditySource.Reduction,
      };
      this.stateManager = new StateManager<FieldGroupState<Members>>(
        initialState,
      );
    } else {
      const { syncResult, observableResult } = this.validatorSuite.validate(
        this.reducer.state.value,
      );
      const initialState: FieldGroupState<Members> = {
        ...syncResult,
        includedMemberNames: this.reducer.state.includedMemberNames,
        validitySource: FieldGroupValiditySource.Validation,
      };
      this.stateManager = new StateManager<FieldGroupState<Members>>(
        initialState,
      );
      this.validatorSuiteSubscription = observableResult?.subscribe(result => {
        this.state = {
          ...result,
          includedMemberNames: this.reducer.state.includedMemberNames,
          validitySource: FieldGroupValiditySource.Validation,
        };
      });
    }
    this.subscribeToReducer();
  }

  public subscribeToState(
    cb: (state: FieldGroupState<Members>) => void,
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
          validitySource: FieldGroupValiditySource.Reduction,
        };
      } else {
        const { syncResult, observableResult } = this.validatorSuite.validate(
          state.value,
        );
        this.state = {
          ...syncResult,
          includedMemberNames: state.includedMemberNames,
          validitySource: FieldGroupValiditySource.Validation,
        };
        this.validatorSuiteSubscription = observableResult?.subscribe(
          result => {
            this.state = {
              ...result,
              includedMemberNames: state.includedMemberNames,
              validitySource: FieldGroupValiditySource.Validation,
            };
          },
        );
      }
    });
  }
}
