import { Subject, type Subscription } from 'rxjs';
import {
  createRecordFromNameableArray,
  isResettable,
  isSubmittable,
} from '../../utils';
import { FormReducerFactory } from '../../factories';
import type {
  IForm,
  FormChild,
  FormState,
  SetExclude,
  Identifiable,
  PossiblyTransient,
} from '../interfaces';
import type { AutoTrim, FormMembers, FormValue } from '../types';
import type {
  StateWithChanges,
  Excludable,
  ExcludableState,
  RecordFromNameableArray,
} from '../../shared';
import type { FormReducer } from '../../reducers';
import clone from 'just-clone';

export type AbstractExcludableSubFormConstructorParams<
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
    FormChild<T, FormValue<S>>,
    PossiblyTransient<U>,
    Excludable,
    SetExclude,
    Identifiable
{
  public readonly name: T;
  public readonly fields: RecordFromNameableArray<S['fields']>;
  public readonly groups: RecordFromNameableArray<S['groups']>;
  public readonly transient: U;
  public readonly id: string;
  protected stateChanges = new Subject<
    StateWithChanges<ExcludableSubFormState<S>>
  >();
  protected reducer: FormReducer<S>;
  protected excludeByDefault: boolean;
  protected _state: ExcludableSubFormState<S>;
  protected valueChanged = false;
  protected validityChanged = false;
  protected submittedChanged = false;
  protected excludeChanged = false;

  public get state(): StateWithChanges<ExcludableSubFormState<S>> {
    return {
      ...this._state,
      didPropertyChange: (prop: keyof ExcludableSubFormState<S>): boolean => {
        switch (prop) {
          case 'value':
            return this.valueChanged;
          case 'validity':
            return this.validityChanged;
          case 'exclude':
            return this.excludeChanged;
          case 'submitted':
            return this.submittedChanged;
          default:
            return false;
        }
      },
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
      adapters,
      groups,
      autoTrim,
    });

    this._state = {
      ...clone(this.reducer.state),
      exclude: this.excludeByDefault,
      submitted: false,
    };

    this.subscribeToReducer();
  }

  public subscribeToState(
    cb: (state: StateWithChanges<ExcludableSubFormState<S>>) => void,
  ): Subscription {
    return this.stateChanges.subscribe(cb);
  }

  public setExclude(exclude: boolean): void {
    this.excludeChanged = this._state.exclude !== exclude;
    this.valueChanged = false;
    this.validityChanged = false;
    this.submittedChanged = false;

    this._state = {
      ...this._state,
      exclude,
    };

    this.stateChanges.next(this.state);
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
    this.excludeChanged = false;

    this._state = {
      ...this._state,
      submitted: true,
    };

    this.stateChanges.next(this.state);
  }

  public reset(): void {
    this.excludeChanged = this._state.exclude !== this.excludeByDefault;
    this.submittedChanged = !!this._state.submitted;
    this.valueChanged = false;
    this.validityChanged = false;

    this._state = {
      ...this.state,
      submitted: false,
      exclude: this.excludeByDefault,
    };

    this.stateChanges.next(this.state);

    this.resetFields();
  }

  protected resetFields(): void {
    for (const field of Object.values(this.fields)) {
      if (isResettable(field)) {
        field.reset();
      }
    }
  }

  protected subscribeToReducer(): void {
    this.reducer.subscribeToState(state => {
      this.valueChanged = state.didPropertyChange('value');
      this.validityChanged = state.didPropertyChange('validity');
      this.submittedChanged = false;
      this.excludeChanged = false;

      this._state = {
        value: this.valueChanged ? clone(state.value) : this.state.value,
        validity: state.validity,
        submitted: this.state.submitted,
        exclude: this._state.exclude,
      };

      this.stateChanges.next(this.state);
    });
  }
}
