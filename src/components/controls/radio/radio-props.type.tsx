import type { ReactNode, CSSProperties } from 'react';
import type { AnyForm, AnyStringTypeField, ChildOfForm } from '../../../model';
import type { GetControlClassName, GetControlStyle } from '../../types';

export type RadioProps<
  Form extends AnyForm,
  Field extends AnyStringTypeField & ChildOfForm<Form>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  value: string;
  labelContent: ReactNode;
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
