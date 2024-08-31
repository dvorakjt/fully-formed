import {
  ExcludableField,
  type ExcludableFieldConstructorParams,
} from './excludable-field';
import { createPersistenceKey } from '../../utils';

type PersistentExcludableFieldConstructorParams<
  T extends string,
  U,
  V extends boolean,
> = ExcludableFieldConstructorParams<T, U, V> & {
  key: string;
};

export class PersistentExcludableField<
  T extends string,
  U,
  V extends boolean = false,
> extends ExcludableField<T, U, V> {
  public constructor(
    params: PersistentExcludableFieldConstructorParams<T, U, V>,
  ) {
    let defaultValue = params.defaultValue;
    let excludeByDefault = params.excludeByDefault;

    const key = createPersistenceKey(params.key);
    const storedState = sessionStorage.getItem(key);

    if (storedState !== null) {
      const parsedState = JSON.parse(storedState);
      defaultValue = parsedState.value;
      excludeByDefault = parsedState.exclude;
    }

    super({
      ...params,
      defaultValue,
      excludeByDefault,
    });

    /*
      Set defaultValue and excludeByDefault so that reset() works as expected.
    */
    this.defaultValue = params.defaultValue;
    this.excludeByDefault = !!params.excludeByDefault;

    this.subscribeToState(({ value, exclude, didPropertyChange }) => {
      if (didPropertyChange('value') || didPropertyChange('exclude')) {
        const stringifiedState = JSON.stringify({
          value,
          exclude,
        });

        sessionStorage.setItem(key, stringifiedState);
      }
    });
  }
}
