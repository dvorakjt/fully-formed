import { useValue } from '.';
import type { ChangeEventHandler } from 'react';
import type { Validated, SetValue, ValueOf } from '../model';

type UserInputProps<T extends Validated<string> & SetValue<string>> = {
  value: ValueOf<T>;
  onChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
};

/**
 * A React hook that can be passed into the props of an HTML input, select or
 * textarea element via spread syntax. The hook sets the value of the element
 * to the current value of the provided entity and updates the value of the
 * entity when the element's `onChange` event is triggered.
 *
 * @param entity - An instance of a class that implements
 * {@link Validated}\<string\> and {@link SetValue}\<string\>.
 *
 * @returns An object that can be passed into the props of an HTML input, select
 * or textarea element via spread syntax.
 */
export function useUserInput<T extends Validated<string> & SetValue<string>>(
  entity: T,
): UserInputProps<T> {
  const props: UserInputProps<T> = {
    value: useValue(entity),
    onChange: e => entity.setValue(e.target.value),
  };

  return props;
}
