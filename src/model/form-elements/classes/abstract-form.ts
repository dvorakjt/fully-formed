import { Subject, type Subscription } from 'rxjs';
import clone from 'just-clone';
import {
  createRecordFromNameableArray,
  isResettable,
  isSubmittable,
} from '../../utils';
import { FormReducerFactory } from '../../factories';
import type { StateWithChanges, RecordFromNameableArray } from '../../shared';
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
  private stateChanges = new Subject<StateWithChanges<FormState<T>>>();
  private reducer: FormReducer<T>;
  private _state: FormState<T>;
  private valueChanged = false;
  private validityChanged = false;
  private submittedChanged = false;

  public get state(): StateWithChanges<FormState<T>> {
    return {
      ...this._state,
      didPropertyChange: (prop: keyof FormState): boolean => {
        switch (prop) {
          case 'value':
            return this.valueChanged;
          case 'validity':
            return this.validityChanged;
          case 'submitted':
            return this.submittedChanged;
          default:
            return false;
        }
      },
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
      adapters,
      groups,
      autoTrim,
    });

    this._state = {
      ...clone(this.reducer.state),
      submitted: false,
    };

    this.subscribeToReducer();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<FormState<T>>) => void,
  ): Subscription {
    return this.stateChanges.subscribe(cb);
  }

  public setSubmitted(): void {
    for (const field of Object.values(this.fields)) {
      if (isSubmittable(field)) {
        field.setSubmitted();
      }
    }

    this.submittedChanged = !this._state.submitted;
    this.valueChanged = false;
    this.validityChanged = false;

    this._state = {
      ...this.state,
      submitted: true,
    };

    this.stateChanges.next(this.state);
  }

  public reset(): void {
    this.submittedChanged = this._state.submitted;
    this.valueChanged = false;
    this.validityChanged = false;

    this._state = {
      ...this.state,
      submitted: false,
    };

    this.stateChanges.next(this.state);

    this.resetFields();
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
      this.valueChanged = state.didPropertyChange('value');
      this.validityChanged = state.didPropertyChange('validity');
      this.submittedChanged = false;

      this._state = {
        value: this.valueChanged ? clone(state.value) : this.state.value,
        validity: state.validity,
        submitted: this.state.submitted,
      };

      this.stateChanges.next(this.state);
    });
  }
}
