import { AbstractExcludableAdapter } from '../abstract';
import { StateManager, type AbstractStateManager } from '../../../state';
import type { Subscription } from 'rxjs';
import type {
  AbstractFieldGroup,
  FieldGroupMembers,
} from '../../../field-groups';
import type { FormElement } from '../../../form-elements';
import type {
  ExcludableAdaptFn,
  ExcludableAdapterConstructorArgs,
} from '../../types';
import type { ExcludableAdapterState } from '../../types';

export class ExcludableAdapter<
  Name extends string,
  Source extends FormElement | AbstractFieldGroup<string, FieldGroupMembers>,
  Value,
> extends AbstractExcludableAdapter<Name, Source, Value> {
  public readonly name: Name;
  public readonly source: Source;
  private adaptFn: ExcludableAdaptFn<Source, Value>;
  private stateManager: AbstractStateManager<ExcludableAdapterState<Value>>;

  public get state(): ExcludableAdapterState<Value> {
    return this.stateManager.state;
  }

  private set state(state: ExcludableAdapterState<Value>) {
    this.stateManager.state = state;
  }

  public constructor({
    name,
    source,
    adaptFn,
  }: ExcludableAdapterConstructorArgs<Name, Source, Value>) {
    super();
    this.name = name;
    this.source = source;
    this.adaptFn = adaptFn;
    this.stateManager = new StateManager<ExcludableAdapterState<Value>>(
      this.getInitialState(),
    );
    this.subscribeToSource();
  }

  public subscribeToState(
    cb: (state: ExcludableAdapterState<Value>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private getInitialState(): ExcludableAdapterState<Value> {
    return {
      ...this.adaptFn(this.source.state),
      validity: this.source.state.validity,
    };
  }

  private subscribeToSource(): void {
    this.source.subscribeToState(state => {
      this.state = {
        ...this.adaptFn(state),
        validity: state.validity,
      };
    });
  }
}
