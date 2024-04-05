import { AbstractDerivedValue } from '../abstract';
import {
  StatefulArrayReducer,
  type AbstractStatefulArrayReducer,
} from '../../../reducers';
import { StateManager, type AbstractStateManager } from '../../../state';
import type { Subscription } from 'rxjs';
import type { DeriveFn, DerivedValueConstructorArgs } from '../../types';
import type { Stateful } from '../../../shared';

/**
 * Represents a value that can be displayed to the user, used to determine how
 * to render aspects of the UI, etc.
 *
 * @typeParam Name - A string literal which will become the key given to the
 * derived value in the `derivedValues` property of its parent form.
 *
 * @typeParam Sources - A readonly array of form elements and/or groups whose
 * states will determine the derived value.
 *
 * @typeParam Value - The type of value that the derived value will produce.
 */
export class DerivedValue<
  Name extends string,
  Sources extends ReadonlyArray<Stateful<unknown>>,
  Value,
> extends AbstractDerivedValue<Name, Value> {
  public readonly name: Name;
  private sourcesReducer: AbstractStatefulArrayReducer<Sources>;
  private deriveFn: DeriveFn<Sources, Value>;
  private stateManager: AbstractStateManager<Value>;

  public get value(): Value {
    return this.stateManager.state;
  }

  private set value(value: Value) {
    this.stateManager.state = value;
  }

  public constructor({
    name,
    sources,
    deriveFn,
  }: DerivedValueConstructorArgs<Name, Sources, Value>) {
    super();
    this.name = name;
    this.sourcesReducer = new StatefulArrayReducer<Sources>({
      members: sources,
    });
    this.deriveFn = deriveFn;
    this.stateManager = new StateManager<Value>(this.getInitialValue());
    this.subscribeToReducer();
  }

  /**
   * Executes a callback function whenever the derived value changes.
   *
   * @param cb - The callback function to be executed when the derived value
   * changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToValue(cb: (value: Value) => void): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  private getInitialValue(): Value {
    return this.deriveFn(this.sourcesReducer.state);
  }

  private subscribeToReducer(): void {
    this.sourcesReducer.subscribeToState(state => {
      this.value = this.deriveFn(state);
    });
  }
}
