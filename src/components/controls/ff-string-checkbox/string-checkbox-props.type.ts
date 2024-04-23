import type { ReactNode } from 'react';
import type {
  AnyForm,
  AnyStringTypeField,
  FormChild,
  Excludable,
} from '../../../model';

export type StringCheckboxProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  labelContent: ReactNode;
  value?: string;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
  ['aria-required']?: boolean;
};
