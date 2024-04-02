import { AbstractAdapter } from '../abstract';
import {
  StateManager,
  type AbstractStateManager,
  type State,
} from '../../../state';
import type { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement, FormValue } from '../../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type { AdaptFn, AdapterConstructorArgs } from '../../types';

/**
 * Adapts a value originating from a form element or group into a new value to
 * be included in the value of a form.
 *
 * @typeParam Name - A string literal which will be the key given to the adapted
 * value within a {@link FormValue} object.
 *
 * @typeParam Source - A {@link FormElement} or {@link AbstractGroup} whose
 * state the adapter will subscribe to and adapt.
 *
 * @typeParam Value - The type of value that the adapter produces.
 */
export class Adapter<
  Name extends string,
  Source extends FormElement | AbstractGroup<string, GroupMembers>,
  Value,
> extends AbstractAdapter<Name, Source, Value> {
  public readonly name: Name;
  public readonly source: Source;
  private adaptFn: AdaptFn<Source, Value>;
  private stateManager: AbstractStateManager<State<Value>>;

  public get state(): State<Value> {
    return this.stateManager.state;
  }

  private set state(state: State<Value>) {
    this.stateManager.state = state;
  }

  public constructor({
    name,
    source,
    adaptFn,
  }: AdapterConstructorArgs<Name, Source, Value>) {
    super();
    this.name = name;
    this.source = source;
    this.adaptFn = adaptFn;
    this.stateManager = new StateManager<State<Value>>(this.getInitialState());
    this.subscribeToSource();
  }

  /**
   * Executes a callback function whenever the state of the adapter changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * adapter changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToState(cb: (state: State<Value>) => void): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private getInitialState(): State<Value> {
    return {
      value: this.adaptFn(this.source.state),
      validity: this.source.state.validity,
    };
  }

  private subscribeToSource(): void {
    this.source.subscribeToState(state => {
      this.state = {
        value: this.adaptFn(state),
        validity: state.validity,
      };
    });
  }
}
