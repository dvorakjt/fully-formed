import type { CSSProperties } from 'react';
import type { AnyForm, TypedField, FormChild } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';
import type { MultiSelectProps } from './multi-select-props.type';

export type FFMultiSelectProps<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string[]>>,
> = MultiSelectProps<Form, Field> & {
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
};
