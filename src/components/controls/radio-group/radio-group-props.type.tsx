import type { CSSProperties, ReactNode } from 'react';
import type { AnyForm, AnyStringTypeField, ChildOfForm } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';

export type RadioGroupProps<
  Form extends AnyForm,
  Field extends AnyStringTypeField & ChildOfForm<Form>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
  children?: ReactNode;
  ['aria-required']?: boolean;
};
