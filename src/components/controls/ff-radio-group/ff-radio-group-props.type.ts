import type { CSSProperties } from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { RadioGroupProps } from './radio-group-props.type';
import type { GetControlClassName, GetControlStyle } from '../../types';

export type FFRadioGroupProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = RadioGroupProps<Form, Field> & {
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
};
