import {
  AbstractFormReducer,
  type AbstractValueReducer,
  type AbstractFormValidityReducer,
} from '../abstract';
import { ValueReducer } from './value-reducer';
import { FormValidityReducer } from './form-validity-reducer';
import {
  StateManager,
  type AbstractStateManager,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Validity,
} from '../../../state';
import type { Subscription } from 'rxjs';
import type {
  FormConstituents,
  FormElement,
  FormValue,
} from '../../../form-elements';
import type { AbstractAdapter } from '../../../adapters';
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type { FormReducerConstructorArgs, FormReducerState } from '../../types';

/**
 * Produces a {@link FormValue} object and corresponding {@link Validity} based
 * on the states of {@link FormConstituents}.
 */
export class FormReducer<
  Constituents extends FormConstituents,
> extends AbstractFormReducer<Constituents> {
  private stateManager: AbstractStateManager<FormReducerState<Constituents>>;
  private valueReducer: AbstractValueReducer<FormValue<Constituents>>;
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

  public get state(): FormReducerState<Constituents> {
    return this.stateManager.state;
  }

  private set state(state: FormReducerState<Constituents>) {
    this.stateManager.state = state;
  }

  public constructor({
    adapters,
    transientFormElements,
    groups,
  }: FormReducerConstructorArgs) {
    super();
    this.valueReducer = new ValueReducer<FormValue<Constituents>>({
      members: adapters,
    });
    this.validityReducer = new FormValidityReducer({
      adapters,
      transientFormElements,
      groups,
    });
    this.stateManager = new StateManager<FormReducerState<Constituents>>({
      value: this.valueReducer.value,
      validity: this.validityReducer.validity,
    });
    this.adapters = adapters;
    this.transientFormElements = transientFormElements;
    this.groups = groups;
    this.subscribeToConstituents();
  }

  /**
   * Executes a callback function whenever the state of the {@link FormReducer}
   * changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * {@link FormReducer} changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToState(
    cb: (state: FormReducerState<Constituents>) => void,
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
