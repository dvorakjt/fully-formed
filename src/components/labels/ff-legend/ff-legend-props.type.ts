import type { CSSProperties } from 'react';
import type { AnyForm, AnyField, FormChild } from '../../../model';
import type { GetControlClassName } from '../../types';
import type { GetControlStyle } from '../../types';
import type { LegendProps } from './legend-props.type';

export type FFLegendProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyField>,
> = LegendProps<Form, Field> & {
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
};
