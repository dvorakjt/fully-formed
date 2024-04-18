import type { CSSProperties, ReactNode } from 'react';
import type {
  AnyForm,
  AnyBooleanTypeField,
  ChildOfForm,
  Excludable,
} from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';

export type BooleanCheckboxProps<
  Form extends AnyForm,
  Field extends AnyBooleanTypeField & ChildOfForm<Form>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  labelContent: ReactNode;
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
