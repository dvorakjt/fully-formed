import type {
  AnyForm,
  TypedField,
  Excludable,
  FormChild,
} from '../../../model';
import type { AutoCapitalize } from '../../types';

export type TextAreaProps<
  Form extends AnyForm,
  Field extends FormChild<Form, TypedField<string>>,
> = {
  form: Form;
  field: Field;
  groups?: Array<Form['groups'][keyof Form['groups']]>;
  autoCapitalize?: AutoCapitalize;
  autoComplete?: 'on' | 'off';
  autoCorrect?: 'on' | 'off';
  autoFocus?: boolean;
  cols?: number;
  disabled?: boolean;
  disabledWhenExcluded?: Field extends Excludable ? boolean : never;
  maxLength?: number;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  spellCheck?: boolean | 'true' | 'false';
  wrap?: 'hard' | 'soft' | 'off';
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
};
