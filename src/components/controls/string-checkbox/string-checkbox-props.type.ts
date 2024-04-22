import type { CSSProperties, ReactNode } from 'react';
import type {
  AnyForm,
  AnyStringTypeField,
  FormChild,
  Excludable,
} from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';

export type StringCheckboxProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  labelContent: ReactNode;
  value?: string;
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
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
  ['aria-required']?: boolean;
};
