import type {
  AnyForm,
  AnyStringTypeField,
  Excludable,
  FormChild,
} from '../../../model';
import type { Option } from './option.type';

export type SelectProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = {
  form: Form;
  field: Field;
  options: Array<Option<Field>>;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
  multiple?: boolean;
  size?: number;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
};
