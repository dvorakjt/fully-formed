import {
  StateManager,
  type Excludable,
  type ExcludableState,
  type RecordFromNameableArray,
} from '../../shared';
import { createRecordFromNameableArray, isResettable } from '../../utils';
import { FormReducerFactory } from '../../factories';
import type { Subscription } from 'rxjs';
import type {
  IForm,
  FormChild,
  FormState,
  SetExclude,
  Identifiable,
  Submittable,
} from '../interfaces';
import type { AutoTrim, FormMembers, FormValue } from '../types';
import type { FormReducer } from '../../reducers';

type AbstractExcludableSubFormConstructorParams<
  T extends string,
  S extends FormMembers,
  U extends boolean,
> = {
  name: T;
  fields: S['fields'];
  groups: S['groups'];
  adapters: S['adapters'];
  transient?: U;
  excludeByDefault?: boolean;
  id?: string;
  autoTrim?: AutoTrim;
};

type ExcludableSubFormState<T extends FormMembers> = FormState<T> &
  ExcludableState;

export abstract class AbstractExcludableSubForm<
    T extends string,
    S extends FormMembers,
    U extends boolean,
  >
  implements
    IForm<S>,
    FormChild<T, FormValue<S>, U>,
    Excludable,
    SetExclude,
    Identifiable
{
  public readonly name: T;
  public readonly fields: RecordFromNameableArray<S['fields']>;
  public readonly groups: RecordFromNameableArray<S['groups']>;
  public readonly transient: U;
  public readonly id: string;
  private stateManager: StateManager<ExcludableSubFormState<S>>;
  private reducer: FormReducer<S>;
  private excludeByDefault: boolean;

  public get state(): ExcludableSubFormState<S> {
    return this.stateManager.state;
  }

  private set state(state: Partial<ExcludableSubFormState<S>>) {
    this.stateManager.state = {
      ...this.state,
      ...state,
    };
  }

  public constructor({
    name,
    fields,
    groups,
    adapters,
    transient,
    excludeByDefault,
    id = name,
    autoTrim = false,
  }: AbstractExcludableSubFormConstructorParams<T, S, U>) {
    this.name = name;
    this.fields = createRecordFromNameableArray(fields);
    this.groups = createRecordFromNameableArray(groups);
    this.transient = !!transient as U;
    this.excludeByDefault = !!excludeByDefault;
    this.id = id;

    this.reducer = FormReducerFactory.createFormReducer<S>({
      fields,
      groups,
      customAdapters: adapters,
      autoTrim,
    });

    this.stateManager = new StateManager<ExcludableSubFormState<S>>({
      ...this.reducer.state,
      submitted: false,
      exclude: this.excludeByDefault,
    });

    this.subscribeToReducer();
  }

  public subscribeToState(
    cb: (state: ExcludableSubFormState<S>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  public setExclude(exclude: boolean): void {
    this.state = { exclude };
  }

  public setSubmitted(): void {
    for (const field of Object.values(this.fields)) {
      (field as Submittable).setSubmitted();
    }
    this.state = {
      submitted: true,
    };
  }

  public reset(): void {
    this.resetSelf();
    this.resetFields();
  }

  private resetSelf(): void {
    this.state = { submitted: false, exclude: this.excludeByDefault };
  }

  private resetFields(): void {
    for (const field of Object.values(this.fields)) {
      if (isResettable(field)) {
        field.reset();
      }
    }
  }

  private subscribeToReducer(): void {
    this.reducer.subscribeToState(state => {
      this.state = {
        ...state,
        exclude: this.state.exclude,
      };
    });
  }
}
