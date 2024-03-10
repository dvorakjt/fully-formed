import {
  AbstractFormReducer,
  type AbstractValueReducer,
  type AbstractFormValidityReducer,
} from '../abstract';
import { ValueReducer } from './value-reducer';
import { FormValidityReducer } from './form-validity-reducer';
import { StateManager, type AbstractStateManager } from '../../../state';
import type { Subscription } from 'rxjs';
import type { FormElement } from '../../../form-elements';
import type { AbstractAdapter } from '../../../adapters';
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type { FormReducerConstructorArgs, FormReducerState } from '../../types';

export class FormReducer<
  Value extends Record<string, unknown>,
> extends AbstractFormReducer<Value> {
  private stateManager: AbstractStateManager<FormReducerState<Value>>;
  private valueReducer: AbstractValueReducer<Value>;
  private validityReducer: AbstractFormValidityReducer;
  private adapters: Array<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >;
  private transientFormElements: FormElement[];
  private groups: ReadonlyArray<AbstractGroup<string, GroupMembers>>;

  public get state(): FormReducerState<Value> {
    return this.stateManager.state;
  }

  private set state(state: FormReducerState<Value>) {
    this.stateManager.state = state;
  }

  public constructor({
    adapters,
    transientFormElements,
    groups,
  }: FormReducerConstructorArgs) {
    super();
    this.valueReducer = new ValueReducer<Value>({
      members: adapters,
    });
    this.validityReducer = new FormValidityReducer({
      adapters,
      transientFormElements,
      groups,
    });
    this.stateManager = new StateManager<FormReducerState<Value>>({
      value: this.valueReducer.value,
      validity: this.validityReducer.validity,
    });
    this.adapters = adapters;
    this.transientFormElements = transientFormElements;
    this.groups = groups;
    this.subscribeToConstituents();
  }

  public subscribeToState(
    cb: (state: FormReducerState<Value>) => void,
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
    this.transientFormElements.forEach(element => {
      element.subscribeToState(state => {
        this.validityReducer.processTransientElementStateUpdate(
          element.name,
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
