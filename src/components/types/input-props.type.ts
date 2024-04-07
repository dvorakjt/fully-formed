import type { CSSProperties } from 'react';
import type {
  AbstractField,
  AbstractForm,
  FormConstituents,
  PickSingleTypeFormElements,
  Excludable,
  FormElement,
} from '../../model';
import type { GetInputClassName } from './get-input-class-name.type';
import type { StringInputTypes } from './string-input-types';
import type { GetInputStyle } from './get-input-style.type';
import type { AutoCapitalize } from './auto-capitalize.type';

export type InputProps<
  ParentForm extends AbstractForm<string, FormConstituents>,
  FieldName extends keyof PickSingleTypeFormElements<
    ParentForm,
    AbstractField<string, string, boolean>
  >,
  Type extends StringInputTypes,
> = {
  form: ParentForm;
  fieldName: FieldName;
  type: Type;
  groupNames?: Array<keyof ParentForm['groups']>;
  className?: string;
  getClassName?: GetInputClassName<ParentForm['formElements'][FieldName]>;
  style?: CSSProperties;
  getStyle?: GetInputStyle<ParentForm['formElements'][FieldName]>;
  autoFocus?: Type extends 'hidden' ? never : boolean;
  autoCapitalize?: Type extends 'url' | 'email' | 'password' ? never
  : AutoCapitalize;
  autoComplete?: string;
  placeholder?: string;
  list?: Type extends 'hidden' | 'password' ? never : string;
  max?: Type extends (
    'date' | 'month' | 'week' | 'time' | 'datetime-local' | 'number' | 'range'
  ) ?
    number | string
  : never;
  min?: Type extends (
    'date' | 'month' | 'week' | 'time' | 'datetime-local' | 'number' | 'range'
  ) ?
    number | string
  : never;
  maxLength?: Type extends (
    'text' | 'search' | 'url' | 'tel' | 'email' | 'password'
  ) ?
    number
  : never;
  size?: Type extends 'email' | 'password' | 'tel' | 'url' | 'text' ? number
  : never;
  step?: Type extends (
    'date' | 'month' | 'week' | 'time' | 'datetime-local' | 'number' | 'range'
  ) ?
    'any' | number
  : never;
} & (DisabledWhenExcluded<ParentForm['formElements'][FieldName]> | Disabled);

type DisabledWhenExcluded<Field extends FormElement> = {
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
};

type Disabled = {
  disabledWhenExcluded?: never;
  disabled?: boolean;
};
