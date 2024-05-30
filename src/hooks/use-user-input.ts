import { useValue } from '.';
import type { ChangeEventHandler } from 'react';
import type { Validated, SetValue, ValueOf } from '../model';

type UserInputProps<T extends Validated<string> & SetValue<string>> = {
  value: ValueOf<T>;
  onChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
};

export function useUserInput<T extends Validated<string> & SetValue<string>>(
  entity: T,
): UserInputProps<T> {
  const props: UserInputProps<T> = {
    value: useValue(entity),
    onChange: e => entity.setValue(e.target.value),
  };

  return props;
}
