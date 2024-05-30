import { Subject, type Subscription } from 'rxjs';
import { ValueReducer } from './value-reducer';
import { FormValidityReducer } from './form-validity-reducer';
import type { StateWithChanges, Validated, ValidatedState } from '../../shared';
import type { FormMembers, FormValue, FormChild } from '../../form-elements';
import type { IGroup } from '../../groups';
import type { IAdapter } from '../../adapters';
import clone from 'just-clone';

type FormReducerConstructorParams = {
  nonTransientFieldsAndAdapters: Array<FormChild | IAdapter>;
  transientFields: FormChild[];
  groups: readonly IGroup[];
};

export class FormReducer<T extends FormMembers>
  implements Validated<FormValue<T>>
{
  private stateChanges = new Subject<
    StateWithChanges<ValidatedState<FormValue<T>>>
  >();
  private valueReducer: ValueReducer<FormValue<T>>;
  private validityReducer: FormValidityReducer;
  private _state: ValidatedState<FormValue<T>>;
  private valueChanged = false;
  private validityChanged = false;

  public get state(): StateWithChanges<ValidatedState<FormValue<T>>> {
    return {
      ...this._state,
      didPropertyChange: (prop: keyof ValidatedState): boolean => {
        if (prop === 'value') {
          return this.valueChanged;
        } else {
          return this.validityChanged;
        }
      },
    };
  }

  public constructor({
    nonTransientFieldsAndAdapters,
    transientFields,
    groups,
  }: FormReducerConstructorParams) {
    this.valueReducer = new ValueReducer<FormValue<T>>({
      members: nonTransientFieldsAndAdapters,
    });

    this.validityReducer = new FormValidityReducer({
      nonTransientFieldsAndAdapters,
      transientFields,
      groups,
    });

    this._state = {
      value: clone(this.valueReducer.state.value),
      validity: this.validityReducer.validity,
    };

    this.subscribeToNonTransientFieldsAndAdapters(
      nonTransientFieldsAndAdapters,
    );
    this.subscribeToTransientFields(transientFields);
    this.subscribeToGroups(groups);
  }

  public subscribeToState(
    cb: (state: StateWithChanges<ValidatedState<FormValue<T>>>) => void,
  ): Subscription {
    return this.stateChanges.subscribe(cb);
  }

  private subscribeToNonTransientFieldsAndAdapters(
    nonTransientFieldsAndAdapters: Array<FormChild | IAdapter>,
  ): void {
    nonTransientFieldsAndAdapters.forEach(fieldOrAdapter => {
      fieldOrAdapter.subscribeToState(state => {
        this.valueReducer.processMemberStateUpdate(fieldOrAdapter.name, state);
        this.validityReducer.processNonTransientFieldOrAdapterStateUpdate(
          fieldOrAdapter.name,
          state,
        );

        this.valueChanged = this.valueReducer.state.didValueChange;
        this.validityChanged =
          this.validityReducer.validity !== this._state.validity;

        this._state = {
          value:
            this.valueChanged ?
              clone(this.valueReducer.state.value)
            : this._state.value,
          validity: this.validityReducer.validity,
        };

        this.stateChanges.next(this.state);
      });
    });
  }

  private subscribeToTransientFields(transientFields: FormChild[]): void {
    transientFields.forEach(field => {
      field.subscribeToState(state => {
        this.validityReducer.processTransientElementStateUpdate(
          field.name,
          state,
        );

        this.valueChanged = false;
        this.validityChanged =
          this.validityReducer.validity !== this._state.validity;

        this._state = {
          ...this.state,
          validity: this.validityReducer.validity,
        };

        this.stateChanges.next(this.state);
      });
    });
  }

  private subscribeToGroups(groups: readonly IGroup[]): void {
    groups.forEach(group => {
      group.subscribeToState(state => {
        this.validityReducer.processGroupStateUpdate(group.name, state);

        this.valueChanged = false;
        this.validityChanged =
          this.validityReducer.validity !== this._state.validity;

        this._state = {
          ...this.state,
          validity: this.validityReducer.validity,
        };

        this.stateChanges.next(this.state);
      });
    });
  }
}
