import { AbstractAdapter } from '../abstract';
import {
  StateManager,
  type AbstractStateManager,
  type State,
} from '../../../state';
import type { Subscription } from 'rxjs';
import type { FormElement } from '../../../form-elements';
import type {
  AbstractFieldGroup,
  FieldGroupMembers,
} from '../../../field-groups';
import type { AdaptFn, AdapterConstructorArgs } from '../../types';

export class Adapter<
  Name extends string,
  Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
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
