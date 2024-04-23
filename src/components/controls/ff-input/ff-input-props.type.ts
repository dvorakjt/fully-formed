import type { CSSProperties } from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';
import type { InputProps } from './input-props.type';

export type FFInputProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = InputProps<Form, Field> & {
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
};
