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
      if (didPropertyChange('exclude')) {
        const stringifiedState = JSON.stringify({
          exclude,
        });

        sessionStorage.setItem(key, stringifiedState);
      }
    });
  }
}
