import type { ReactNode } from 'react';
import type {
  AnyForm,
  TypedField,
  FormChild,
  Excludable,
} from '../../../model';

export type RadioProps<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string>>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  value: Field['state']['value'];
  labelContent: ReactNode;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
};
