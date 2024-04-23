import type { ReactNode } from 'react';
import type {
  AnyForm,
  AnyBooleanTypeField,
  FormChild,
  Excludable,
} from '../../../model';

export type CheckboxProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyBooleanTypeField>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  labelContent: ReactNode;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
  ['aria-required']?: boolean;
};
