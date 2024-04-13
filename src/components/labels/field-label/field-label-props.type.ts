import type { CSSProperties, ReactNode } from 'react';
import type { AnyForm, AnyField, ChildOfForm } from '../../../model';
import type { GetFieldLabelClassName } from './get-field-label-classname.type';
import type { GetFieldLabelStyle } from './get-field-label-style.type';

export type FieldLabelProps<
  Form extends AnyForm,
  Field extends AnyField & ChildOfForm<Form>,
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
