import type { CSSProperties } from 'react';
import type { AnyForm, AnyBooleanTypeField, FormChild } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';
import type { BooleanCheckboxProps } from './boolean-checkbox-props.type';

export type FFBooleanCheckboxProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyBooleanTypeField>,
> = BooleanCheckboxProps<Form, Field> & {
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
