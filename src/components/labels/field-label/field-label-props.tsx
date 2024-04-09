import type { CSSProperties, ReactNode } from 'react';
import type {
  AbstractField,
  AbstractForm,
  FormConstituents,
} from '../../../model';
import type { GetFieldLabelClassName } from './get-field-label-classname';
import type { GetFieldLabelStyle } from './get-field-label-style';

export type FieldLabelProps<
  Form extends AbstractForm<string, FormConstituents>,
  Field extends AbstractField<string, unknown, boolean> &
    Form['formElements'][keyof Form['formElements']],
> = {
  field: Field;
  form: Form;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  className?: string;
  getClassName?: GetFieldLabelClassName<Field>;
  style?: CSSProperties;
  getStyle?: GetFieldLabelStyle<Field>;
  children?: ReactNode;
};
