import type { ReactNode } from 'react';
import type {
  AnyForm,
  TypedField,
  Excludable,
  FormChild,
} from '../../../model';

export type MultiSelectProps<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string[]>>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  children?: ReactNode;
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
  size?: number;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
};
