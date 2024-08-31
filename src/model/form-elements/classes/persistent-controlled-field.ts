import {
  ControlledField,
  type ControlledFieldConstructorParams,
} from './controlled-field';
import { createPersistenceKey } from '../../utils';
import type { Stateful } from '../../shared';

type PersistentControlledFieldConstructorParams<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean,
> = ControlledFieldConstructorParams<T, S, U, V> & {
  key: string;
};

export class PersistentControlledField<
  T extends string,
  S,
  U extends Stateful,
  V extends boolean = false,
> extends ControlledField<T, S, U, V> {
  public constructor(
    params: PersistentControlledFieldConstructorParams<T, S, U, V>,
  ) {
    let initFn = params.initFn;
    const key = createPersistenceKey(params.key);

    if (typeof window !== 'undefined') {
      const storedState = sessionStorage.getItem(key);

      if (storedState !== null) {
        const parsedState = JSON.parse(storedState);
        const storedValue = parsedState.value as S;
        initFn = (): S => storedValue;
      }
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

    this.subscribeToState(({ value, didPropertyChange }) => {
      if (didPropertyChange('value')) {
        const stringifiedState = JSON.stringify({ value });
        sessionStorage.setItem(key, stringifiedState);
      }
    });
  }
}
