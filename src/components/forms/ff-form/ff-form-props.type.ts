import type { AnyForm } from '../../../model';
import type { FormProps } from './form-props.type';
import type { GetFormClassName, GetFormStyle } from '../../types';
import type { CSSProperties } from 'react';

export type FFFormProps<Form extends AnyForm> = FormProps<Form> & {
  className?: string;
  getClassName?: GetFormClassName;
  style?: CSSProperties;
  getStyle?: GetFormStyle;
};
