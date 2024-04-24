import type { CSSProperties } from 'react';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { RadioProps } from './radio-props.type';
import type { GetControlClassName, GetControlStyle } from '../../types';

export type FFRadioProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = RadioProps<Form, Field> & {
  containerClassName?: string;
  getContainerClassName?: GetControlClassName<Field>;
  containerStyle?: CSSProperties;
  getContainerStyle?: GetControlStyle<Field>;
  radioClassName?: string;
  getRadioClassName?: GetControlClassName<Field>;
  radioStyle?: CSSProperties;
  getRadioStyle?: GetControlStyle<Field>;
  labelClassName?: string;
  getLabelClassName?: GetControlClassName<Field>;
  labelStyle?: CSSProperties;
  getLabelStyle?: GetControlStyle<Field>;
};
