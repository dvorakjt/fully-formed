import { StateManager, type RecordFromNameableArray } from '../../shared';
import {
  createRecordFromNameableArray,
  isResettable,
  isSubmittable,
} from '../../utils';
import { FormReducerFactory } from '../../factories';
import type { Subscription } from 'rxjs';
import type { IForm, FormState } from '../interfaces';
import type { AutoTrim, FormMembers } from '../types';
import type { FormReducer } from '../../reducers';

type AbstractFormConstructorParams<T extends FormMembers> = {
  fields: T['fields'];
  groups: T['groups'];
  adapters: T['adapters'];
  autoTrim?: AutoTrim;
};

export abstract class AbstractForm<T extends FormMembers> implements IForm<T> {
  public readonly fields: RecordFromNameableArray<T['fields']>;
  public readonly groups: RecordFromNameableArray<T['groups']>;
  private stateManager: StateManager<FormState<T>>;
  private reducer: FormReducer<T>;

  public get state(): FormState<T> {
    return this.stateManager.state;
  }

  private set state(state: Partial<FormState<T>>) {
    this.stateManager.state = {
      ...this.state,
      ...state,
    };
  }

  public constructor({
    fields,
    adapters,
    groups,
    autoTrim = false,
  }: AbstractFormConstructorParams<T>) {
    this.fields = createRecordFromNameableArray(fields);
    this.groups = createRecordFromNameableArray(groups);

    this.reducer = FormReducerFactory.createFormReducer<T>({
      fields,
      customAdapters: adapters,
      groups,
      autoTrim,
    });

    this.stateManager = new StateManager<FormState<T>>({
      ...this.reducer.state,
      submitted: false,
    });

    this.subscribeToReducer();
  }

  public subscribeToState(cb: (state: FormState<T>) => void): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  public setSubmitted(): void {
    for (const field of Object.values(this.fields)) {
      if (isSubmittable(field)) {
        field.setSubmitted();
      }
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
    this.state = {
      submitted: false,
    };
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
      };
    });
  }
}
