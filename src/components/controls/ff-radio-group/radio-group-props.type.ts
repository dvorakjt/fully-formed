import type { ReactNode } from 'react';
import type { AnyForm, TypedField, FormChild } from '../../../model';

export type RadioGroupProps<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string>>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  children?: ReactNode;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
};
