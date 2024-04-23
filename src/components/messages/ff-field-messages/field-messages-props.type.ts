import type { AnyForm, AnyField, FormChild } from '../../../model';

export type FieldMessagesProps<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyField>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
};
