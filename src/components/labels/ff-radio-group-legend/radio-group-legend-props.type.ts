import type { ReactNode } from 'react';
import type { AnyForm, AnyField, FormChild } from '../../../model';

export type RadioGroupLegendProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyField>,
> = {
  field: Field;
  form: Form;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  children?: ReactNode;
};
