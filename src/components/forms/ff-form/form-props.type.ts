import type { ReactNode } from 'react';
import type { AnyForm } from '../../../model';

export type FormProps<Form extends AnyForm> = {
  form: Form;
  onConfirmSuccess: (value: Form['state']['value']) => void;
  onConfirmFailure?: () => void;
  acceptCharset?: string;
  autoCapitalize?: string;
  autoComplete?: 'on' | 'off';
  ['aria-label']?: string;
  ['aria-labelledby']?: string;
  children?: ReactNode;
};
