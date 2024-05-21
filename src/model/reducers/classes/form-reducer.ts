import { ValueReducer } from './value-reducer';
import { FormValidityReducer } from './form-validity-reducer';
import {
  StateManager,
  type Validated,
  type ValidatedState,
} from '../../shared';
import type { Subscription } from 'rxjs';
import type { FormMembers, FormValue, FormChild } from '../../form-elements';
import type { IGroup } from '../../groups';
import type { IAdapter } from '../../adapters';

type FormReducerConstructorParams = {
  transientFields: FormChild[];
  groups: readonly IGroup[];
  adapters: IAdapter[];
};

export class FormReducer<T extends FormMembers>
  implements Validated<FormValue<T>>
{
  private stateManager: StateManager<ValidatedState<FormValue<T>>>;
  private valueReducer: ValueReducer<FormValue<T>>;
  private validityReducer: FormValidityReducer;
  private adapters: IAdapter[];
  private transientFields: FormChild[];
  private groups: readonly IGroup[];

  public get state(): ValidatedState<FormValue<T>> {
    return this.stateManager.state;
  }

  private set state(state: ValidatedState<FormValue<T>>) {
    this.stateManager.state = state;
  }

  public constructor({
    adapters,
    transientFields,
    groups,
  }: FormReducerConstructorParams) {
    this.valueReducer = new ValueReducer<FormValue<T>>({
      members: adapters,
    });
    this.validityReducer = new FormValidityReducer({
      adapters,
      transientFields,
      groups,
    });
    this.stateManager = new StateManager<ValidatedState<FormValue<T>>>({
      value: this.valueReducer.value,
      validity: this.validityReducer.validity,
    });
    this.adapters = adapters;
    this.transientFields = transientFields;
    this.groups = groups;
    this.subscribeToConstituents();
  }

  public subscribeToState(
    cb: (state: ValidatedState<FormValue<T>>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private subscribeToConstituents(): void {
    this.subscribeToAdapters();
    this.subscribeToTransientFormElements();
    this.subscribeToGroups();
  }

  private subscribeToAdapters(): void {
    this.adapters.forEach(adapter => {
      adapter.subscribeToState(state => {
        this.valueReducer.processMemberStateUpdate(adapter.name, state);
        this.validityReducer.processAdapterStateUpdate(adapter.name, state);
        this.state = {
          value: this.valueReducer.value,
          validity: this.validityReducer.validity,
        };
      });
    });
  }

  private subscribeToTransientFormElements(): void {
    this.transientFields.forEach(field => {
      field.subscribeToState(state => {
        this.validityReducer.processTransientElementStateUpdate(
          field.name,
          state,
        );
        this.state = {
          ...this.state,
          validity: this.validityReducer.validity,
        };
      });
    });
  }

  private subscribeToGroups(): void {
    this.groups.forEach(group => {
      group.subscribeToState(state => {
        this.validityReducer.processGroupStateUpdate(group.name, state);
        this.state = {
          ...this.state,
          validity: this.validityReducer.validity,
        };
      });
    });
  }
}
