import type { CSSProperties } from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';
import type { StringCheckboxProps } from './string-checkbox-props.type';

export type FFStringCheckboxProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = StringCheckboxProps<Form, Field> & {
  containerClassName?: string;
  getContainerClassName?: GetControlClassName<Field>;
  containerStyle?: CSSProperties;
  getContainerStyle?: GetControlStyle<Field>;
  checkboxClassName?: string;
  getCheckboxClassName?: GetControlClassName<Field>;
  checkboxStyle?: CSSProperties;
  getCheckboxStyle?: GetControlStyle<Field>;
  labelClassName?: string;
  getLabelClassName?: GetControlClassName<Field>;
  labelStyle?: CSSProperties;
  getLabelStyle?: GetControlStyle<Field>;
};
