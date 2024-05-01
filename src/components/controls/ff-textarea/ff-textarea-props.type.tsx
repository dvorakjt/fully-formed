import type { CSSProperties } from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';
import type { TextAreaProps } from './textarea-props.type';

export type FFTextAreaProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = TextAreaProps<Form, Field> & {
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
};
