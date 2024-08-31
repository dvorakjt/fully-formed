import { Field, type FieldConstructorParams } from './field';
import { createPersistenceKey } from '../../utils';

type PersistentFieldConstructorParams<
  T extends string,
  U,
  V extends boolean,
> = FieldConstructorParams<T, U, V> & {
  key: string;
};

export class PersistentField<
  T extends string,
  U,
  V extends boolean = false,
> extends Field<T, U, V> {
  public constructor(params: PersistentFieldConstructorParams<T, U, V>) {
    let defaultValue = params.defaultValue;
    const key = createPersistenceKey(params.key);
    const storedState = sessionStorage.getItem(key);

    if (storedState !== null) {
      const parsedState = JSON.parse(storedState);
      defaultValue = parsedState.value;
    }

    super({
      ...params,
      defaultValue,
    });

    /*
      Set the default value to the received default so that reset() works as
      expected.
    */
    this.defaultValue = params.defaultValue;

    this.subscribeToState(({ value, didPropertyChange }) => {
      if (didPropertyChange('value')) {
        const stringifiedState = JSON.stringify({ value });
        sessionStorage.setItem(key, stringifiedState);
      }
    });
  }
}
