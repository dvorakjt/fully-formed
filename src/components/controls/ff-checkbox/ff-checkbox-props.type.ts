import type { CSSProperties } from 'react';
import type { AnyForm, AnyBooleanTypeField, FormChild } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';
import type { CheckboxProps } from './checkbox-props.type';

export type FFCheckboxProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyBooleanTypeField>,
> = CheckboxProps<Form, Field> & {
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
