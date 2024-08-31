import {
  ControlledExcludableField,
  type ControlledExcludableFieldConstructorParams,
} from './controlled-excludable-field';
import { createPersistenceKey } from '../../utils';
import type { Stateful } from '../../shared';

type PersistentControlledExcludableFieldConstructorParams<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean,
> = ControlledExcludableFieldConstructorParams<T, S, U, V> & {
  key: string;
};

export class PersistentControlledExcludableField<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean = false,
> extends ControlledExcludableField<T, S, U, V> {
  public constructor(
    params: PersistentControlledExcludableFieldConstructorParams<T, S, U, V>,
  ) {
    let initFn = params.initFn;
    const key = createPersistenceKey(params.key);
    const storedState = sessionStorage.getItem(key);

    if (storedState !== null) {
      const parsedState = JSON.parse(storedState);
      initFn = (): { value: S; exclude: boolean } => parsedState;
    }

    super({
      ...params,
      initFn,
    });

    /*
      Set initFn to the function passed in as an argument so that reset() works 
      as expected.
    */
    this.initFn = params.initFn;

    this.subscribeToState(({ value, exclude, didPropertyChange }) => {
      if (didPropertyChange('value') || didPropertyChange('exclude')) {
        const stringifiedState = JSON.stringify({ value, exclude });
        sessionStorage.setItem(key, stringifiedState);
      }
    });
  }
}
