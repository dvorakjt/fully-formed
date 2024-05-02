import type { ReactNode } from 'react';
import type {
  AnyForm,
  TypedField,
  Excludable,
  FormChild,
} from '../../../model';

export type SelectProps<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string>>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
  size?: number;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
  children?: ReactNode;
};
