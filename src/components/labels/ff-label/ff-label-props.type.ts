import type { CSSProperties } from 'react';
import type { AnyForm, AnyField, FormChild } from '../../../model';
import type { GetControlClassName } from '../../types';
import type { GetControlStyle } from '../../types';
import type { LabelProps } from './label-props.type';

export type FFLabelProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyField>,
> = LabelProps<Form, Field> & {
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
};
