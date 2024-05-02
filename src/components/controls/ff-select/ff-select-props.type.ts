import type { CSSProperties } from 'react';
import type { AnyForm, TypedField, FormChild } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';
import type { SelectProps } from './select-props.type';

export type FFSelectProps<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string>>,
> = SelectProps<Form, Field> & {
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
};
