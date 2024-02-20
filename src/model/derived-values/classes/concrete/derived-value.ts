import { AbstractDerivedValue } from '../abstract';
import { StatefulArrayReducer, type AbstractStatefulArrayReducer } from '../../../reducers';
import { StateManager, type AbstractStateManager } from '../../../state';
import type { Subscription } from 'rxjs';
import type { Derive, DerivedValueConstructorArgs } from '../../types';
import type { Stateful } from '../../../shared';

export class DerivedValue<
  Name extends string,
  Sources extends ReadonlyArray<
    Stateful<unknown>
  >,
  V,
> extends AbstractDerivedValue<Name, V> {
  public readonly name: Name;
  private sourcesReducer : AbstractStatefulArrayReducer<Sources>;
  private derive : Derive<Sources, V>;
  private stateManager : AbstractStateManager<V>;
  
  public get value(): V {
    return this.stateManager.state;
  }

  private set value(value : V) {
    this.stateManager.state = value;
  }

  public constructor({
    name,
    sources,
    derive
  } : DerivedValueConstructorArgs<Name, Sources, V>) {
    super();
    this.name = name;
    this.sourcesReducer = new StatefulArrayReducer<Sources>({ members : sources });
    this.derive = derive;
    this.stateManager = new StateManager<V>(this.getInitialValue());
    this.subscribeToReducer();
  }

  public subscribeToValue(cb: (value: V) => void): Subscription {
    return this.stateManager.subscribeToState(cb);
  }
  
  private getInitialValue() : V {
    return this.derive(this.sourcesReducer.state);
  }

  private subscribeToReducer() : void {
    this.sourcesReducer.subscribeToState(state => {
      this.value = this.derive(state);
    });
  }
}
