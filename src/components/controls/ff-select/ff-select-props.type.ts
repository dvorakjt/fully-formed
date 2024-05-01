import type { CSSProperties } from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';
import type { SelectProps } from './select-props.type';

export type FFSelectProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = SelectProps<Form, Field> & {
  selectClassName?: string;
  getSelectClassName?: GetControlClassName<Field>;
  selectStyle?: CSSProperties;
  getSelectStyle?: GetControlStyle<Field>;
  optionClassName?: string;
  getOptionClassName?: GetControlClassName<Field>;
  optionStyle?: CSSProperties;
  getOptionStyle?: GetControlStyle<Field>;
};
