import type { ReactNode } from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';

export type RadioGroupProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  children?: ReactNode;
  ['aria-required']?: boolean;
};
