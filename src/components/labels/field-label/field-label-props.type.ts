import type { CSSProperties, ReactNode } from 'react';
import type { AnyForm, AnyField, FormChild } from '../../../model';
import type { GetFieldLabelClassName } from './get-field-label-classname.type';
import type { GetFieldLabelStyle } from './get-field-label-style.type';

export type FieldLabelProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyField>,
> = {
  field: Field;
  form: Form;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  className?: string;
  getClassName?: GetFieldLabelClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetFieldLabelStyle<Field>;
  children?: ReactNode;
};
