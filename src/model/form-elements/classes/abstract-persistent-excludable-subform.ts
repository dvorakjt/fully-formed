import {
  AbstractExcludableSubForm,
  type AbstractExcludableSubFormConstructorParams,
} from './abstract-excludable-subform';
import { createPersistenceKey } from '../../utils';
import type { FormMembers } from '../types';

type AbstractPersistentExcludableSubFormConstructorParams<
  T extends string,
  S extends FormMembers,
  U extends boolean,
> = AbstractExcludableSubFormConstructorParams<T, S, U> & {
  key: string;
};

export class AbstractPersistentExcludableSubForm<
  T extends string,
  S extends FormMembers,
  U extends boolean,
> extends AbstractExcludableSubForm<T, S, U> {
  public constructor(
    params: AbstractPersistentExcludableSubFormConstructorParams<T, S, U>,
  ) {
    let excludeByDefault = params.excludeByDefault;

    const key = createPersistenceKey(params.key);

    /* 
      check if window is undefined to ensure that sessionStorage is only 
      accessed client-side, i.e. not during server-side rendering.
    */
    if (typeof window !== 'undefined') {
      const storedState = sessionStorage.getItem(key);

      if (storedState !== null) {
        const parsedState = JSON.parse(storedState);
        excludeByDefault = parsedState.exclude;
      }
    }

    super({
      ...params,
      excludeByDefault,
    });

    /*
      Set excludeByDefault so that reset() works as expected.
    */
    this.excludeByDefault = !!params.excludeByDefault;

    this.subscribeToState(({ exclude, didPropertyChange }) => {
      /* istanbul ignore else -- @preserve */
      if (didPropertyChange('exclude')) {
        const stringifiedState = JSON.stringify({
          exclude,
        });

        sessionStorage.setItem(key, stringifiedState);
      }
    });
  }
}
