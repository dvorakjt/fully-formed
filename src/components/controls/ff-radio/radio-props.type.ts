import type { ReactNode } from 'react';
import type {
  AnyForm,
  AnyStringTypeField,
  FormChild,
  Excludable,
} from '../../../model';

export type RadioButtonProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  value: Field['state']['value'];
  labelContent: ReactNode;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
};
