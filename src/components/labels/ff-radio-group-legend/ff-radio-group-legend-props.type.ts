import type { CSSProperties } from 'react';
import type { AnyForm, AnyField, FormChild } from '../../../model';
import type { GetControlClassName } from '../../types';
import type { GetControlStyle } from '../../types';
import type { RadioGroupLegendProps } from './radio-group-legend-props.type';

export type FFRadioGroupLegendProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyField>,
> = RadioGroupLegendProps<Form, Field> & {
  className?: string;
  getClassName?: GetControlClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetControlStyle<Field>;
};
