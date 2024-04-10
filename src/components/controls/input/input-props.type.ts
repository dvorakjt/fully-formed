import type {
  AnyForm,
  AnyStringTypeField,
  ChildOfForm,
  Excludable,
} from '../../../model';
import type { AutoCapitalize } from '../../types';
import type { GetInputClassName } from './get-input-classname.type';
import type { GetInputStyle } from './get-input-style.type';
import type { StringInputTypes } from './string-input-types.type';

export type InputProps<
  Form extends AnyForm,
  Field extends AnyStringTypeField & ChildOfForm<Form>,
> = {
  field: Field;
  form: Form;
  type: StringInputTypes;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  className?: string;
  getClassName?: GetInputClassName<Field>;
  style?: React.CSSProperties;
  getStyle?: GetInputStyle<Field>;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
  readOnly?: boolean;
  autoFocus?: boolean;
  autoCapitalize?: AutoCapitalize;
  autoComplete?: string;
  placeholder?: string;
  list?: string;
  max?: number | string;
  min?: number | string;
  maxLength?: number;
  size?: number;
  step?: number;
  ['aria-required']?: boolean;
};
